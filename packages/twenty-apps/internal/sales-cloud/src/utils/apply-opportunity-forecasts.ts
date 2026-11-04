import {
  computeForecastPatch,
  type ForecastChange,
  type OpportunityForecastRecord,
} from 'src/utils/compute-opportunity-forecast';
import { fetchAll } from 'src/utils/fetch-all';
import { type CrmClient } from 'src/utils/lead-conversion-types';

const OPPORTUNITY_FORECAST_SELECTION = {
  id: true,
  stage: true,
  amount: { amountMicros: true, currencyCode: true },
  probability: true,
  forecastCategory: true,
  expectedRevenue: { amountMicros: true, currencyCode: true },
};

const NO_CHANGE: ForecastChange = {
  stageChanged: false,
  probabilitySetByUser: false,
  forecastCategorySetByUser: false,
};

const writePatches = async (
  client: CrmClient,
  opportunities: OpportunityForecastRecord[],
  changeFor: (id: string) => ForecastChange,
): Promise<number> => {
  let updated = 0;

  for (const opportunity of opportunities) {
    const patch = computeForecastPatch(opportunity, changeFor(opportunity.id));

    if (!patch) {
      continue;
    }

    // Writing only what changed keeps the update event this write causes
    // from producing another write, so the trigger never loops.
    await client.mutation({
      updateOpportunity: { __args: { id: opportunity.id, data: patch }, id: true },
    });
    updated++;
  }

  return updated;
};

// Reads the opportunities fresh rather than trusting the event payload, so a
// later edit in the same batch is never overwritten with stale values.
export const applyOpportunityForecasts = async (
  client: CrmClient,
  changes: Map<string, ForecastChange>,
): Promise<number> => {
  if (changes.size === 0) {
    return 0;
  }

  const opportunities = await fetchAll<OpportunityForecastRecord>(
    client,
    'opportunities',
    { id: { in: [...changes.keys()] } },
    OPPORTUNITY_FORECAST_SELECTION,
  );

  return writePatches(client, opportunities, (id) => changes.get(id) ?? NO_CHANGE);
};

// Fills the forecast fields on opportunities that don't have them yet, such as
// every opportunity that existed before the app was installed.
export const backfillOpportunityForecasts = async (
  client: CrmClient,
): Promise<number> => {
  const opportunities = await fetchAll<OpportunityForecastRecord>(
    client,
    'opportunities',
    { or: [{ probability: { is: 'NULL' } }, { forecastCategory: { is: 'NULL' } }] },
    OPPORTUNITY_FORECAST_SELECTION,
  );

  return writePatches(client, opportunities, () => NO_CHANGE);
};
