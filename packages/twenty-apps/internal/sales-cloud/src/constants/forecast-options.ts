import { FORECAST_CATEGORY_OPTION_IDS } from 'src/constants/campaign-forecast-identifiers';

// Salesforce's forecast categories. Omitted is how a lost deal leaves the
// forecast, since Twenty's default stages have no "lost" stage.
export enum ForecastCategory {
  PIPELINE = 'PIPELINE',
  BEST_CASE = 'BEST_CASE',
  COMMIT = 'COMMIT',
  CLOSED = 'CLOSED',
  OMITTED = 'OMITTED',
}

export const FORECAST_CATEGORY_OPTIONS = [
  { id: FORECAST_CATEGORY_OPTION_IDS.PIPELINE, value: ForecastCategory.PIPELINE, label: 'Pipeline', position: 0, color: 'sky' as const },
  { id: FORECAST_CATEGORY_OPTION_IDS.BEST_CASE, value: ForecastCategory.BEST_CASE, label: 'Best case', position: 1, color: 'blue' as const },
  { id: FORECAST_CATEGORY_OPTION_IDS.COMMIT, value: ForecastCategory.COMMIT, label: 'Commit', position: 2, color: 'purple' as const },
  { id: FORECAST_CATEGORY_OPTION_IDS.CLOSED, value: ForecastCategory.CLOSED, label: 'Closed', position: 3, color: 'green' as const },
  { id: FORECAST_CATEGORY_OPTION_IDS.OMITTED, value: ForecastCategory.OMITTED, label: 'Omitted', position: 4, color: 'gray' as const },
];

// Twenty's closed-won stage. Opportunities here count as won in campaign ROI.
export const WON_OPPORTUNITY_STAGE = 'CUSTOMER';

// What a stage change resets probability and forecast category to, the way
// Salesforce stage defaults work. A stage not listed (a workspace's own custom
// stage) leaves both as they are.
export const STAGE_FORECAST_DEFAULTS: Record<
  string,
  { probability: number; forecastCategory: ForecastCategory }
> = {
  NEW: { probability: 10, forecastCategory: ForecastCategory.PIPELINE },
  SCREENING: { probability: 20, forecastCategory: ForecastCategory.PIPELINE },
  MEETING: { probability: 40, forecastCategory: ForecastCategory.BEST_CASE },
  PROPOSAL: { probability: 70, forecastCategory: ForecastCategory.COMMIT },
  [WON_OPPORTUNITY_STAGE]: { probability: 100, forecastCategory: ForecastCategory.CLOSED },
};
