import { backfillOpportunityForecasts } from 'src/utils/apply-opportunity-forecasts';
import { type CrmClient } from 'src/utils/lead-conversion-types';
import { recomputeAllCampaignRollups } from 'src/utils/recompute-campaign-rollups';
import { recomputeAllQuotes } from 'src/utils/sync-quotes';

// Backfill first: campaign pipeline leaves out Omitted opportunities, so
// categories must be in place before the campaign totals are summed.
export const refreshForecastsAndCampaigns = async (client: CrmClient) => {
  const opportunitiesUpdated = await backfillOpportunityForecasts(client);
  const campaignsUpdated = await recomputeAllCampaignRollups(client);
  const quotesUpdated = await recomputeAllQuotes(client);

  return { opportunitiesUpdated, campaignsUpdated, quotesUpdated };
};
