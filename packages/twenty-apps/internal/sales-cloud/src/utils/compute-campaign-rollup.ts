import {
  ForecastCategory,
  WON_OPPORTUNITY_STAGE,
} from 'src/constants/forecast-options';
import { CampaignMemberStatus } from 'src/constants/campaign-options';
import { LeadStatus } from 'src/constants/lead-options';
import { DEFAULT_CURRENCY_CODE, hasAmount } from 'src/utils/currency';
import { type Currency } from 'src/utils/lead-conversion-types';

export type CampaignRecord = {
  id: string;
  actualCost?: Currency | null;
  budgetedCost?: Currency | null;
};

export type CampaignLeadRecord = { campaignId?: string | null; status?: string | null };

export type CampaignOpportunityRecord = {
  campaignId?: string | null;
  stage?: string | null;
  forecastCategory?: string | null;
  amount?: Currency | null;
};

export type CampaignMemberRecord = {
  campaignId?: string | null;
  memberStatus?: string | null;
};

export type CampaignRollup = {
  memberCount: number;
  respondedMemberCount: number;
  leadCount: number;
  convertedLeadCount: number;
  opportunityCount: number;
  wonOpportunityCount: number;
  pipelineAmount: { amountMicros: number; currencyCode: string };
  wonAmount: { amountMicros: number; currencyCode: string };
  roiPercent: number | null;
  otherCurrencyOpportunityCount: number;
};

// Amounts are only summed in one currency, never converted: the campaign's
// cost currency, else the one most of its opportunities use.
export const resolveCampaignCurrency = (
  campaign: CampaignRecord,
  opportunities: CampaignOpportunityRecord[],
): string => {
  const costCurrency =
    campaign.actualCost?.currencyCode || campaign.budgetedCost?.currencyCode;

  if (costCurrency) {
    return costCurrency;
  }

  const countByCurrency = new Map<string, number>();

  for (const opportunity of opportunities) {
    const code = opportunity.amount?.currencyCode;

    if (hasAmount(opportunity.amount) && code) {
      countByCurrency.set(code, (countByCurrency.get(code) ?? 0) + 1);
    }
  }

  let mostUsed: string | undefined;

  for (const [code, count] of countByCurrency) {
    if (!mostUsed || count > countByCurrency.get(mostUsed)!) {
      mostUsed = code;
    }
  }

  return mostUsed ?? DEFAULT_CURRENCY_CODE;
};

export const computeCampaignRollup = (
  campaign: CampaignRecord,
  leads: CampaignLeadRecord[],
  opportunities: CampaignOpportunityRecord[],
  members: CampaignMemberRecord[] = [],
): CampaignRollup => {
  const currencyCode = resolveCampaignCurrency(campaign, opportunities);
  let pipelineMicros = 0;
  let wonMicros = 0;
  let wonOpportunityCount = 0;
  let otherCurrencyOpportunityCount = 0;

  for (const opportunity of opportunities) {
    const isWon = opportunity.stage === WON_OPPORTUNITY_STAGE;

    if (isWon) {
      wonOpportunityCount++;
    }

    if (!hasAmount(opportunity.amount)) {
      continue;
    }

    if (opportunity.amount.currencyCode !== currencyCode) {
      otherCurrencyOpportunityCount++;
      continue;
    }

    if (isWon) {
      wonMicros += opportunity.amount.amountMicros;
    } else if (opportunity.forecastCategory !== ForecastCategory.OMITTED) {
      pipelineMicros += opportunity.amount.amountMicros;
    }
  }

  const cost = campaign.actualCost;
  const roiPercent =
    hasAmount(cost) && cost.amountMicros > 0 && cost.currencyCode === currencyCode
      ? Math.round(((wonMicros - cost.amountMicros) / cost.amountMicros) * 100)
      : null;

  return {
    memberCount: members.length,
    respondedMemberCount: members.filter(
      (member) => member.memberStatus === CampaignMemberStatus.RESPONDED,
    ).length,
    leadCount: leads.length,
    convertedLeadCount: leads.filter((lead) => lead.status === LeadStatus.CONVERTED).length,
    opportunityCount: opportunities.length,
    wonOpportunityCount,
    pipelineAmount: { amountMicros: pipelineMicros, currencyCode },
    wonAmount: { amountMicros: wonMicros, currencyCode },
    roiPercent,
    otherCurrencyOpportunityCount,
  };
};
