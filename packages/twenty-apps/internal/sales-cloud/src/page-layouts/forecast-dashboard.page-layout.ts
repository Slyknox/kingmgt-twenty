import {
  AggregateOperations,
  definePageLayout,
  PageLayoutTabLayoutMode,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  CAMPAIGN_FIELD_UNIVERSAL_IDENTIFIERS as CAMPAIGN_FIELDS,
  CAMPAIGN_UNIVERSAL_IDENTIFIER,
  FORECAST_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  FORECAST_DASHBOARD_TAB_UNIVERSAL_IDENTIFIER,
  FORECAST_DASHBOARD_WIDGET_UNIVERSAL_IDENTIFIERS as W,
  FORECAST_FIELD_UNIVERSAL_IDENTIFIERS as FORECAST_FIELDS,
} from 'src/constants/campaign-forecast-identifiers';
import { ForecastCategory } from 'src/constants/forecast-options';

const opportunity = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity;

const CHART_DEFAULTS = { timezone: 'UTC', firstDayOfTheWeek: 1 } as const;

// Chart-config values the SDK doesn't export as enums (passed as string literals).
const BAR = {
  layout: 'VERTICAL',
  primaryAxisOrderBy: 'FIELD_ASC',
  axisNameDisplay: 'NONE',
  color: 'auto',
  ...CHART_DEFAULTS,
} as const;

const categoryFilter = (categories: ForecastCategory[]) => ({
  recordFilters: [
    {
      fieldMetadataUniversalIdentifier: FORECAST_FIELDS.forecastCategory,
      operand: 'IS',
      value: JSON.stringify(categories),
    },
  ],
});

// Salesforce's forecast rolls Pipeline, Best case and Commit up as open deals.
const OPEN = [
  ForecastCategory.PIPELINE,
  ForecastCategory.BEST_CASE,
  ForecastCategory.COMMIT,
];

const tile = (column: number) => ({
  layoutMode: PageLayoutTabLayoutMode.GRID as const,
  row: 0,
  column,
  rowSpan: 2,
  columnSpan: 3,
});

const sumTile = (
  universalIdentifier: string,
  title: string,
  column: number,
  aggregateField: string,
  categories: ForecastCategory[],
) => ({
  universalIdentifier,
  title,
  type: 'GRAPH' as const,
  objectUniversalIdentifier: opportunity.universalIdentifier,
  position: tile(column),
  configuration: {
    configurationType: 'AGGREGATE_CHART' as const,
    aggregateFieldMetadataUniversalIdentifier: aggregateField,
    aggregateOperation: AggregateOperations.SUM,
    displayDataLabel: true,
    filter: categoryFilter(categories),
    ...CHART_DEFAULTS,
  },
});

export default definePageLayout({
  universalIdentifier: FORECAST_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  name: 'Forecast',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: FORECAST_DASHBOARD_TAB_UNIVERSAL_IDENTIFIER,
      title: 'Forecast',
      position: 0,
      icon: 'IconChartArrows',
      layoutMode: PageLayoutTabLayoutMode.GRID,
      widgets: [
        sumTile(W.openPipeline, 'Open pipeline', 0, opportunity.fields.amount.universalIdentifier, OPEN),
        sumTile(W.weightedPipeline, 'Weighted pipeline', 3, FORECAST_FIELDS.expectedRevenue, OPEN),
        sumTile(W.commit, 'Commit', 6, opportunity.fields.amount.universalIdentifier, [ForecastCategory.COMMIT]),
        sumTile(W.closedWon, 'Closed', 9, opportunity.fields.amount.universalIdentifier, [ForecastCategory.CLOSED]),
        {
          universalIdentifier: W.weightedByMonth,
          title: 'Weighted pipeline by close month',
          type: 'GRAPH',
          objectUniversalIdentifier: opportunity.universalIdentifier,
          position: { layoutMode: PageLayoutTabLayoutMode.GRID, row: 2, column: 0, rowSpan: 6, columnSpan: 8 },
          configuration: {
            configurationType: 'BAR_CHART',
            aggregateFieldMetadataUniversalIdentifier: FORECAST_FIELDS.expectedRevenue,
            aggregateOperation: AggregateOperations.SUM,
            primaryAxisGroupByFieldMetadataUniversalIdentifier:
              opportunity.fields.closeDate.universalIdentifier,
            primaryAxisDateGranularity: 'MONTH',
            secondaryAxisGroupByFieldMetadataUniversalIdentifier:
              FORECAST_FIELDS.forecastCategory,
            groupMode: 'STACKED',
            displayLegend: true,
            omitNullValues: true,
            filter: categoryFilter(OPEN),
            ...BAR,
          },
        },
        {
          universalIdentifier: W.pipelineByCategory,
          title: 'Amount by forecast category',
          type: 'GRAPH',
          objectUniversalIdentifier: opportunity.universalIdentifier,
          position: { layoutMode: PageLayoutTabLayoutMode.GRID, row: 2, column: 8, rowSpan: 6, columnSpan: 4 },
          configuration: {
            configurationType: 'BAR_CHART',
            aggregateFieldMetadataUniversalIdentifier: opportunity.fields.amount.universalIdentifier,
            aggregateOperation: AggregateOperations.SUM,
            primaryAxisGroupByFieldMetadataUniversalIdentifier:
              FORECAST_FIELDS.forecastCategory,
            ...BAR,
          },
        },
        {
          universalIdentifier: W.campaignWonByType,
          title: 'Campaign won amount by type',
          type: 'GRAPH',
          objectUniversalIdentifier: CAMPAIGN_UNIVERSAL_IDENTIFIER,
          position: { layoutMode: PageLayoutTabLayoutMode.GRID, row: 8, column: 0, rowSpan: 5, columnSpan: 6 },
          configuration: {
            configurationType: 'BAR_CHART',
            aggregateFieldMetadataUniversalIdentifier: CAMPAIGN_FIELDS.wonAmount,
            aggregateOperation: AggregateOperations.SUM,
            primaryAxisGroupByFieldMetadataUniversalIdentifier: CAMPAIGN_FIELDS.campaignType,
            ...BAR,
            primaryAxisOrderBy: 'VALUE_DESC',
          },
        },
        {
          universalIdentifier: W.campaignPipelineByType,
          title: 'Campaign open pipeline by type',
          type: 'GRAPH',
          objectUniversalIdentifier: CAMPAIGN_UNIVERSAL_IDENTIFIER,
          position: { layoutMode: PageLayoutTabLayoutMode.GRID, row: 8, column: 6, rowSpan: 5, columnSpan: 6 },
          configuration: {
            configurationType: 'BAR_CHART',
            aggregateFieldMetadataUniversalIdentifier: CAMPAIGN_FIELDS.pipelineAmount,
            aggregateOperation: AggregateOperations.SUM,
            primaryAxisGroupByFieldMetadataUniversalIdentifier: CAMPAIGN_FIELDS.campaignType,
            ...BAR,
            primaryAxisOrderBy: 'VALUE_DESC',
          },
        },
      ],
    },
  ],
});
