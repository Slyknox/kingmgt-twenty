import {
  type ForecastCategory,
  STAGE_FORECAST_DEFAULTS,
} from 'src/constants/forecast-options';
import {
  emptyCurrency,
  hasAmount,
  isSameCurrencyValue,
} from 'src/utils/currency';
import { type Currency } from 'src/utils/lead-conversion-types';

export type OpportunityForecastRecord = {
  id: string;
  stage?: string | null;
  amount?: Currency | null;
  probability?: number | null;
  forecastCategory?: string | null;
  expectedRevenue?: Currency | null;
};

// What happened to the record, read from the database events.
export type ForecastChange = {
  stageChanged: boolean;
  probabilitySetByUser: boolean;
  forecastCategorySetByUser: boolean;
};

export type ForecastPatch = {
  probability?: number;
  forecastCategory?: ForecastCategory;
  expectedRevenue?: { amountMicros: number | null; currencyCode: string };
};

const clampProbability = (value: number) =>
  Math.min(100, Math.max(0, Math.round(value)));

// A stage change resets probability and category to the stage's defaults,
// unless the same edit set them by hand. A record that has neither gets the
// defaults too. Expected revenue always follows amount × probability.
export const computeForecastPatch = (
  opportunity: OpportunityForecastRecord,
  change: ForecastChange,
): ForecastPatch | null => {
  const defaults = opportunity.stage
    ? STAGE_FORECAST_DEFAULTS[opportunity.stage]
    : undefined;
  const patch: ForecastPatch = {};

  let probability =
    typeof opportunity.probability === 'number'
      ? opportunity.probability
      : null;

  if (
    defaults &&
    ((change.stageChanged && !change.probabilitySetByUser) || probability === null)
  ) {
    probability = defaults.probability;
  }

  if (probability !== null) {
    probability = clampProbability(probability);

    if (probability !== opportunity.probability) {
      patch.probability = probability;
    }
  }

  if (
    defaults &&
    ((change.stageChanged && !change.forecastCategorySetByUser) ||
      !opportunity.forecastCategory) &&
    defaults.forecastCategory !== opportunity.forecastCategory
  ) {
    patch.forecastCategory = defaults.forecastCategory;
  }

  const expectedRevenue =
    hasAmount(opportunity.amount) && probability !== null
      ? {
          amountMicros: Math.round(
            (opportunity.amount.amountMicros * probability) / 100,
          ),
          currencyCode: opportunity.amount.currencyCode || emptyCurrency().currencyCode,
        }
      : emptyCurrency(opportunity.amount?.currencyCode);

  if (!isSameCurrencyValue(expectedRevenue, opportunity.expectedRevenue)) {
    patch.expectedRevenue = expectedRevenue;
  }

  return Object.keys(patch).length > 0 ? patch : null;
};

type ForecastEvent = {
  recordId: string;
  properties: {
    updatedFields?: string[];
    after?: { probability?: number | null; forecastCategory?: string | null } | null;
  };
};

// Reads the batch's events into one change per opportunity. A created record
// counts as a stage change, with whatever probability or category it was
// created with treated as set by hand.
export const collectForecastChanges = (
  batchName: string,
  events: ForecastEvent[],
): Map<string, ForecastChange> => {
  const action = batchName.split('.').pop();
  const changes = new Map<string, ForecastChange>();

  if (action === 'deleted' || action === 'destroyed') {
    return changes;
  }

  for (const event of events) {
    const updatedFields = event.properties.updatedFields ?? [];
    const isCreate = action === 'created' || action === 'upserted';
    const change: ForecastChange = isCreate
      ? {
          stageChanged: true,
          probabilitySetByUser: typeof event.properties.after?.probability === 'number',
          forecastCategorySetByUser: Boolean(event.properties.after?.forecastCategory),
        }
      : {
          stageChanged: updatedFields.includes('stage'),
          probabilitySetByUser: updatedFields.includes('probability'),
          forecastCategorySetByUser: updatedFields.includes('forecastCategory'),
        };
    const previous = changes.get(event.recordId);

    changes.set(
      event.recordId,
      previous
        ? {
            stageChanged: previous.stageChanged || change.stageChanged,
            probabilitySetByUser:
              previous.probabilitySetByUser || change.probabilitySetByUser,
            forecastCategorySetByUser:
              previous.forecastCategorySetByUser || change.forecastCategorySetByUser,
          }
        : change,
    );
  }

  return changes;
};
