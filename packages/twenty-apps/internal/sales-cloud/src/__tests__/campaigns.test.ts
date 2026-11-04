import { describe, expect, it } from 'vitest';

import { createFakeCrmClient } from 'src/__tests__/fake-crm-client';
import { computeCampaignRollup } from 'src/utils/compute-campaign-rollup';
import { convertLeads } from 'src/utils/convert-leads';
import { parseEcbRates, planEcbRateUpdates, syncEcbRates } from 'src/utils/ecb-rates';
import { buildExchangeRates, convertMicros } from 'src/utils/exchange-rates';
import { syncCampaignMembers } from 'src/utils/sync-campaign-members';
import {
  collectCampaignIds,
  recomputeAllCampaignRollups,
  recomputeCampaignRollups,
} from 'src/utils/recompute-campaign-rollups';

const usd = (dollars: number) => ({ amountMicros: dollars * 1_000_000, currencyCode: 'USD' });
const eur = (euros: number) => ({ amountMicros: euros * 1_000_000, currencyCode: 'EUR' });
const NOW = () => new Date('2026-11-04T12:00:00.000Z');

describe('computeCampaignRollup', () => {
  it('counts leads and opportunities and works out pipeline, won amount and ROI', () => {
    const rollup = computeCampaignRollup(
      { id: 'c', actualCost: usd(10_000) },
      [{ status: 'CONVERTED' }, { status: 'WORKING' }, { status: 'CONVERTED' }],
      [
        { stage: 'CUSTOMER', amount: usd(30_000) },
        { stage: 'PROPOSAL', forecastCategory: 'COMMIT', amount: usd(8_000) },
        { stage: 'MEETING', forecastCategory: 'OMITTED', amount: usd(99_000) },
        { stage: 'NEW', amount: eur(5_000) },
        { stage: 'NEW', amount: null },
      ],
    );

    expect(rollup).toEqual({
      memberCount: 0,
      respondedMemberCount: 0,
      leadCount: 3,
      convertedLeadCount: 2,
      opportunityCount: 5,
      wonOpportunityCount: 1,
      pipelineAmount: usd(8_000),
      wonAmount: usd(30_000),
      roiPercent: 200,
      otherCurrencyOpportunityCount: 1,
    });
  });

  it('has no ROI without an actual cost and sums in the currency most deals use', () => {
    const rollup = computeCampaignRollup({ id: 'c' }, [], [
      { stage: 'CUSTOMER', amount: eur(100) },
      { stage: 'CUSTOMER', amount: eur(50) },
      { stage: 'CUSTOMER', amount: usd(70) },
    ]);

    expect(rollup).toMatchObject({ wonAmount: eur(150), roiPercent: null, otherCurrencyOpportunityCount: 1 });
  });

  it('shows a loss as negative ROI', () => {
    expect(computeCampaignRollup({ id: 'c', actualCost: usd(1000) }, [], [{ stage: 'CUSTOMER', amount: usd(250) }]).roiPercent).toBe(-75);
  });
});

describe('currency conversion', () => {
  it('converts deals in other currencies and leaves out ones with no rate', () => {
    const rates = buildExchangeRates([
      { currencyCode: 'usd', isCorporate: true, unitsPerCorporateUnit: 1 },
      { currencyCode: 'EUR', unitsPerCorporateUnit: 0.5 },
      { currencyCode: 'GBP', unitsPerCorporateUnit: 0 },
    ]);

    expect(
      computeCampaignRollup({ id: 'c', actualCost: usd(1000) }, [], [
        { stage: 'CUSTOMER', amount: eur(500) },
        { stage: 'CUSTOMER', amount: { amountMicros: 1_000_000, currencyCode: 'GBP' } },
        { stage: 'NEW', amount: usd(10) },
      ], [], rates),
    ).toMatchObject({ wonAmount: usd(1000), pipelineAmount: usd(10), roiPercent: 0, otherCurrencyOpportunityCount: 1 });
  });

  it('converts between two non-corporate currencies', () => {
    const rates = buildExchangeRates([
      { currencyCode: 'USD', isCorporate: true },
      { currencyCode: 'EUR', unitsPerCorporateUnit: 0.8 },
      { currencyCode: 'GBP', unitsPerCorporateUnit: 0.75 },
    ]);

    expect(convertMicros(80_000_000, 'EUR', 'GBP', rates)).toBe(75_000_000);
    expect(convertMicros(5, 'EUR', 'JPY', rates)).toBeNull();
    expect(convertMicros(5, 'EUR', 'GBP', buildExchangeRates([]))).toBeNull();
  });

  it('uses the stored rates when recomputing', async () => {
    const { client, tables } = createFakeCrmClient({
      exchangeRate: [{ id: 'r1', currencyCode: 'USD', isCorporate: true }, { id: 'r2', currencyCode: 'EUR', unitsPerCorporateUnit: 0.5 }],
      campaign: [{ id: 'c', actualCost: usd(100) }],
      opportunity: [{ id: 'o', campaignId: 'c', stage: 'CUSTOMER', amount: eur(100) }],
    });

    await recomputeCampaignRollups({ client, campaignIds: ['c'], now: NOW });

    expect(tables.campaign[0]).toMatchObject({ wonAmount: usd(200), roiPercent: 100 });
  });
});

describe('ECB rates', () => {
  const XML = `<Cube time='2026-11-04'><Cube currency='USD' rate='1.25'/><Cube currency='GBP' rate='0.8'/><Cube currency='JPY' rate='160'/></Cube>`;

  it('re-bases ECB rates on the corporate currency and skips pinned or unknown rows', () => {
    expect(parseEcbRates(XML).get('USD')).toBe(1.25);
    expect(
      planEcbRateUpdates(
        [
          { id: 'usd', currencyCode: 'USD', isCorporate: true },
          { id: 'eur', currencyCode: 'EUR', unitsPerCorporateUnit: 0.7 },
          { id: 'gbp', currencyCode: 'GBP', autoUpdate: false, unitsPerCorporateUnit: 0.6 },
          { id: 'chf', currencyCode: 'CHF', unitsPerCorporateUnit: 0.9 },
        ],
        parseEcbRates(XML),
      ),
    ).toEqual([{ id: 'eur', unitsPerCorporateUnit: 0.8 }]);
  });

  it('does nothing without a corporate currency', () => {
    expect(planEcbRateUpdates([{ id: 'eur', currencyCode: 'EUR' }], parseEcbRates(XML))).toEqual([]);
  });

  it('writes the updated rates', async () => {
    const { client, tables } = createFakeCrmClient({
      exchangeRate: [{ id: 'usd', currencyCode: 'USD', isCorporate: true }, { id: 'jpy', currencyCode: 'JPY', unitsPerCorporateUnit: 100 }],
    });

    expect(await syncEcbRates(client, async () => XML, NOW)).toBe(1);
    expect(tables.exchangeRate[1]).toMatchObject({ unitsPerCorporateUnit: 128, rateUpdatedAt: '2026-11-04T12:00:00.000Z' });
  });
});

describe('recomputeCampaignRollups', () => {
  const seed = () => ({
    campaign: [{ id: 'webinar', actualCost: usd(1000) }, { id: 'idle' }],
    lead: [{ id: 'l1', campaignId: 'webinar', status: 'NEW' }],
    opportunity: [{ id: 'o1', campaignId: 'webinar', stage: 'CUSTOMER', amount: usd(4000) }],
  });

  it('writes the results and skips campaigns that did not change', async () => {
    const { client, tables, updates } = createFakeCrmClient(seed());

    expect(await recomputeCampaignRollups({ client, campaignIds: ['webinar', 'webinar'], now: NOW })).toBe(1);
    expect(tables.campaign[0]).toMatchObject({
      leadCount: 1,
      wonAmount: usd(4000),
      roiPercent: 300,
      rollupsUpdatedAt: '2026-11-04T12:00:00.000Z',
    });
    expect(await recomputeCampaignRollups({ client, campaignIds: ['webinar'], now: NOW })).toBe(0);
    expect(updates).toHaveLength(1);
  });

  it('recomputes every campaign, including ones with no members', async () => {
    const { client, tables } = createFakeCrmClient(seed());

    expect(await recomputeAllCampaignRollups(client, NOW)).toBe(2);
    expect(tables.campaign[1]).toMatchObject({ leadCount: 0, opportunityCount: 0, wonAmount: usd(0), roiPercent: null });
  });

  it('recomputes both the campaign a record left and the one it joined', () => {
    expect(
      collectCampaignIds([
        { recordId: 'o1', properties: { before: { campaignId: 'old' }, after: { campaignId: 'new' } } },
        { recordId: 'o2', properties: { before: { campaignId: 'new' } } },
        { recordId: 'o3', properties: { after: { campaignId: null } } },
      ]),
    ).toEqual(['old', 'new']);
  });
});

describe('campaign members', () => {
  it('counts members and responses on the campaign', async () => {
    const { client, tables } = createFakeCrmClient({
      campaign: [{ id: 'webinar', name: 'Webinar' }],
      campaignMember: [
        { id: 'm1', campaignId: 'webinar', memberStatus: 'SENT' },
        { id: 'm2', campaignId: 'webinar', memberStatus: 'RESPONDED' },
        { id: 'm3', campaignId: 'other', memberStatus: 'RESPONDED' },
      ],
    });

    await recomputeCampaignRollups({ client, campaignIds: ['webinar'], now: NOW });

    expect(tables.campaign[0]).toMatchObject({ memberCount: 2, respondedMemberCount: 1 });
  });

  it('names a member and stamps its first response, keeping a typed name', async () => {
    const { client, tables } = createFakeCrmClient({
      campaign: [{ id: 'c', name: 'Webinar' }],
      lead: [{ id: 'l', name: { firstName: 'Ada', lastName: 'Lovelace' } }],
      person: [{ id: 'p', name: { firstName: 'Grace', lastName: 'Hopper' } }],
      campaignMember: [
        { id: 'm1', campaignId: 'c', leadId: 'l', memberStatus: 'RESPONDED' },
        { id: 'm2', campaignId: 'c', leadId: 'l', personId: 'p', memberStatus: 'SENT' },
        { id: 'm3', campaignId: 'c', name: 'VIP', memberStatus: 'RESPONDED', respondedAt: '2026-01-01T00:00:00.000Z' },
      ],
    });

    await syncCampaignMembers(client, ['m1', 'm2', 'm3'], NOW());

    expect(tables.campaignMember.map(({ name, respondedAt }) => [name, respondedAt ?? null])).toEqual([
      ['Webinar - Ada Lovelace', '2026-11-04T12:00:00.000Z'],
      ['Webinar - Grace Hopper', null],
      ['VIP', '2026-01-01T00:00:00.000Z'],
    ]);
  });

  it('merges a lead membership into the person\'s own one for the same campaign', async () => {
    const { client, tables } = createFakeCrmClient({
      lead: [{ id: 'l1', name: { firstName: 'Ada', lastName: 'Lovelace' }, companyName: 'Engines', emails: { primaryEmail: 'ada@engines.io' } }],
      person: [{ id: 'p1', emails: { primaryEmail: 'ada@engines.io' } }],
      campaignMember: [
        { id: 'lead-row', campaignId: 'c', leadId: 'l1', memberStatus: 'RESPONDED', respondedAt: '2026-10-01T00:00:00.000Z' },
        { id: 'person-row', campaignId: 'c', personId: 'p1', memberStatus: 'SENT' },
        { id: 'other', campaignId: 'd', leadId: 'l1', memberStatus: 'SENT' },
      ],
    });

    await convertLeads({ client, leadIds: ['l1'], now: NOW });

    const live = tables.campaignMember.filter((member) => !member.deletedAt);
    expect(live.map(({ id, personId, memberStatus }) => [id, personId, memberStatus])).toEqual([
      ['person-row', 'p1', 'RESPONDED'],
      ['other', 'p1', 'SENT'],
    ]);
  });

  it('moves a converted lead\'s memberships onto the new person', async () => {
    const { client, tables } = createFakeCrmClient({
      lead: [{ id: 'l1', name: { firstName: 'Grace', lastName: 'Hopper' }, companyName: 'Navy' }],
      campaignMember: [
        { id: 'm1', campaignId: 'a', leadId: 'l1' },
        { id: 'm2', campaignId: 'b', leadId: 'l1', personId: 'someone-else' },
        { id: 'm3', campaignId: 'a', leadId: 'other' },
      ],
    });

    await convertLeads({ client, leadIds: ['l1'], now: NOW });

    const personId = tables.person[0].id;
    expect(tables.campaignMember.map((member) => member.personId ?? null)).toEqual([personId, 'someone-else', null]);
  });
});

describe('lead conversion and campaigns', () => {
  it("carries the lead's campaign onto the opportunity it becomes", async () => {
    const { client, tables } = createFakeCrmClient({
      lead: [{ id: 'l1', name: { firstName: 'Grace', lastName: 'Hopper' }, companyName: 'Navy', campaignId: 'webinar' }],
    });

    await convertLeads({ client, leadIds: ['l1'], now: NOW });

    expect(tables.opportunity[0].campaignId).toBe('webinar');
  });
});
