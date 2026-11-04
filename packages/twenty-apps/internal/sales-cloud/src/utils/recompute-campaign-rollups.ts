import {
  type CampaignLeadRecord,
  type CampaignOpportunityRecord,
  type CampaignRecord,
  type CampaignRollup,
  computeCampaignRollup,
} from 'src/utils/compute-campaign-rollup';
import { CampaignMemberStatus } from 'src/constants/campaign-options';
import { isSameCurrencyValue } from 'src/utils/currency';
import { type ExchangeRates, loadExchangeRates } from 'src/utils/exchange-rates';
import { fetchAll } from 'src/utils/fetch-all';
import { type CrmClient, type Currency } from 'src/utils/lead-conversion-types';

const CAMPAIGN_IDS_PER_PASS = 50;

const CURRENCY = { amountMicros: true, currencyCode: true };

type StoredCampaign = CampaignRecord & {
  memberCount?: number | null;
  respondedMemberCount?: number | null;
  leadCount?: number | null;
  convertedLeadCount?: number | null;
  opportunityCount?: number | null;
  wonOpportunityCount?: number | null;
  pipelineAmount?: Currency | null;
  wonAmount?: Currency | null;
  roiPercent?: number | null;
  otherCurrencyOpportunityCount?: number | null;
};

const isUnchanged = (stored: StoredCampaign, rollup: CampaignRollup) =>
  stored.memberCount === rollup.memberCount &&
  stored.respondedMemberCount === rollup.respondedMemberCount &&
  stored.leadCount === rollup.leadCount &&
  stored.convertedLeadCount === rollup.convertedLeadCount &&
  stored.opportunityCount === rollup.opportunityCount &&
  stored.wonOpportunityCount === rollup.wonOpportunityCount &&
  stored.otherCurrencyOpportunityCount === rollup.otherCurrencyOpportunityCount &&
  (stored.roiPercent ?? null) === rollup.roiPercent &&
  isSameCurrencyValue(stored.pipelineAmount, rollup.pipelineAmount) &&
  isSameCurrencyValue(stored.wonAmount, rollup.wonAmount);

const groupByCampaignId = <TRecord extends { campaignId?: string | null }>(
  records: TRecord[],
) => {
  const byCampaignId = new Map<string, TRecord[]>();

  for (const record of records) {
    if (record.campaignId) {
      byCampaignId.set(record.campaignId, [
        ...(byCampaignId.get(record.campaignId) ?? []),
        record,
      ]);
    }
  }

  return byCampaignId;
};

const countMembersWhere = async (client: CrmClient, filter: Record<string, unknown>) => {
  const { campaignMembers } = await client.query({
    campaignMembers: { __args: { filter, first: 1 }, totalCount: true },
  });

  return (campaignMembers?.totalCount as number | undefined) ?? 0;
};

// Members are counted with totalCount, not read: a campaign can have far more
// members than one run could page through, and a capped count would look exact.
const countMembers = async (client: CrmClient, campaignIds: string[]) => {
  const counts = new Map<string, { memberCount: number; respondedMemberCount: number }>();

  for (const campaignId of campaignIds) {
    counts.set(campaignId, {
      memberCount: await countMembersWhere(client, { campaignId: { eq: campaignId } }),
      respondedMemberCount: await countMembersWhere(client, {
        campaignId: { eq: campaignId },
        memberStatus: { eq: CampaignMemberStatus.RESPONDED },
      }),
    });
  }

  return counts;
};

const recomputePass = async (
  client: CrmClient,
  campaignIds: string[],
  now: () => Date,
  rates: ExchangeRates,
): Promise<number> => {
  const inCampaigns = { campaignId: { in: campaignIds } };
  const [campaigns, leads, opportunities, members] = await Promise.all([
    fetchAll<StoredCampaign>(client, 'campaigns', { id: { in: campaignIds } }, {
      id: true,
      actualCost: CURRENCY,
      budgetedCost: CURRENCY,
      memberCount: true,
      respondedMemberCount: true,
      leadCount: true,
      convertedLeadCount: true,
      opportunityCount: true,
      wonOpportunityCount: true,
      pipelineAmount: CURRENCY,
      wonAmount: CURRENCY,
      roiPercent: true,
      otherCurrencyOpportunityCount: true,
    }),
    fetchAll<CampaignLeadRecord>(client, 'leads', inCampaigns, {
      campaignId: true,
      status: true,
    }),
    fetchAll<CampaignOpportunityRecord>(client, 'opportunities', inCampaigns, {
      campaignId: true,
      stage: true,
      forecastCategory: true,
      amount: CURRENCY,
    }),
    countMembers(client, campaignIds),
  ]);

  const leadsByCampaignId = groupByCampaignId(leads);
  const opportunitiesByCampaignId = groupByCampaignId(opportunities);

  let updated = 0;

  for (const campaign of campaigns) {
    const rollup: CampaignRollup = {
      ...computeCampaignRollup(
        campaign,
        leadsByCampaignId.get(campaign.id) ?? [],
        opportunitiesByCampaignId.get(campaign.id) ?? [],
        [],
        rates,
      ),
      ...(members.get(campaign.id) ?? { memberCount: 0, respondedMemberCount: 0 }),
    };

    // Skipping unchanged campaigns keeps their timeline free of no-op edits.
    if (isUnchanged(campaign, rollup)) {
      continue;
    }

    await client.mutation({
      updateCampaign: {
        __args: {
          id: campaign.id,
          data: { ...rollup, rollupsUpdatedAt: now().toISOString() },
        },
        id: true,
      },
    });
    updated++;
  }

  return updated;
};

export const recomputeCampaignRollups = async ({
  client,
  campaignIds,
  now = () => new Date(),
}: {
  client: CrmClient;
  campaignIds: Iterable<string>;
  now?: () => Date;
}): Promise<number> => {
  const uniqueIds = [...new Set(campaignIds)].filter(Boolean);
  let updated = 0;

  if (uniqueIds.length === 0) {
    return 0;
  }

  const rates = await loadExchangeRates(client);

  for (let start = 0; start < uniqueIds.length; start += CAMPAIGN_IDS_PER_PASS) {
    updated += await recomputePass(
      client,
      uniqueIds.slice(start, start + CAMPAIGN_IDS_PER_PASS),
      now,
      rates,
    );
  }

  return updated;
};

export const recomputeAllCampaignRollups = async (
  client: CrmClient,
  now: () => Date = () => new Date(),
): Promise<number> => {
  const campaigns = await fetchAll<{ id: string }>(client, 'campaigns', undefined, {
    id: true,
  });

  return recomputeCampaignRollups({
    client,
    campaignIds: campaigns.map(({ id }) => id),
    now,
  });
};

type CampaignLinkEvent = {
  recordId: string;
  properties: {
    before?: { campaignId?: string | null } | null;
    after?: { campaignId?: string | null } | null;
  };
};

// A lead or opportunity moving between campaigns changes both, so the
// campaign it left is recomputed along with the one it joined.
export const collectCampaignIds = (events: CampaignLinkEvent[]): string[] => {
  const campaignIds = new Set<string>();

  for (const { properties } of events) {
    for (const campaignId of [properties.before?.campaignId, properties.after?.campaignId]) {
      if (campaignId) {
        campaignIds.add(campaignId);
      }
    }
  }

  return [...campaignIds];
};
