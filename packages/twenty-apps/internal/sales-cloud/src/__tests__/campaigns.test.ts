import { describe, expect, it } from 'vitest';

import { createFakeCrmClient } from 'src/__tests__/fake-crm-client';
import { computeCampaignRollup } from 'src/utils/compute-campaign-rollup';
import { convertLeads } from 'src/utils/convert-leads';
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

describe('lead conversion and campaigns', () => {
  it("carries the lead's campaign onto the opportunity it becomes", async () => {
    const { client, tables } = createFakeCrmClient({
      lead: [{ id: 'l1', name: { firstName: 'Grace', lastName: 'Hopper' }, companyName: 'Navy', campaignId: 'webinar' }],
    });

    await convertLeads({ client, leadIds: ['l1'], now: NOW });

    expect(tables.opportunity[0].campaignId).toBe('webinar');
  });
});
