import {
  AggregateOperations,
  definePageLayout,
  PageLayoutTabLayoutMode,
} from 'twenty-sdk/define';

import {
  SERVICE_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  SERVICE_DASHBOARD_TAB_UNIVERSAL_IDENTIFIER,
  SERVICE_DASHBOARD_WIDGET_UNIVERSAL_IDENTIFIERS as W,
  SUPPORT_CASE_FIELD_UNIVERSAL_IDENTIFIERS as F,
  SUPPORT_CASE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/support-case-identifiers';
import { OPEN_SUPPORT_CASE_STATUSES } from 'src/constants/support-case-options';

const CHART_DEFAULTS = { timezone: 'UTC', firstDayOfTheWeek: 1 } as const;

// Chart-config values the SDK doesn't export as enums (passed as string literals).
const BAR = {
  layout: 'VERTICAL',
  primaryAxisOrderBy: 'FIELD_ASC',
  axisNameDisplay: 'NONE',
  color: 'auto',
  ...CHART_DEFAULTS,
} as const;

const OPEN_FILTER = {
  fieldMetadataUniversalIdentifier: F.status,
  operand: 'IS',
  value: JSON.stringify(OPEN_SUPPORT_CASE_STATUSES),
};

const grid = (row: number, column: number, rowSpan: number, columnSpan: number) => ({
  layoutMode: PageLayoutTabLayoutMode.GRID as const,
  row,
  column,
  rowSpan,
  columnSpan,
});

export default definePageLayout({
  universalIdentifier: SERVICE_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  name: 'Service',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: SERVICE_DASHBOARD_TAB_UNIVERSAL_IDENTIFIER,
      title: 'Service',
      position: 0,
      icon: 'IconLifebuoy',
      layoutMode: PageLayoutTabLayoutMode.GRID,
      widgets: [
        {
          universalIdentifier: W.openCases,
          title: 'Open cases',
          type: 'GRAPH',
          objectUniversalIdentifier: SUPPORT_CASE_UNIVERSAL_IDENTIFIER,
          position: grid(0, 0, 2, 6),
          configuration: {
            configurationType: 'AGGREGATE_CHART',
            aggregateFieldMetadataUniversalIdentifier: F.subject,
            aggregateOperation: AggregateOperations.COUNT,
            displayDataLabel: true,
            filter: { recordFilters: [OPEN_FILTER] },
            ...CHART_DEFAULTS,
          },
        },
        {
          universalIdentifier: W.breachedCases,
          title: 'Overdue open cases',
          type: 'GRAPH',
          objectUniversalIdentifier: SUPPORT_CASE_UNIVERSAL_IDENTIFIER,
          position: grid(0, 6, 2, 6),
          configuration: {
            configurationType: 'AGGREGATE_CHART',
            aggregateFieldMetadataUniversalIdentifier: F.subject,
            aggregateOperation: AggregateOperations.COUNT,
            displayDataLabel: true,
            filter: {
              recordFilters: [
                OPEN_FILTER,
                { fieldMetadataUniversalIdentifier: F.isSlaBreached, operand: 'IS', value: 'true' },
              ],
            },
            ...CHART_DEFAULTS,
          },
        },
        {
          universalIdentifier: W.openByPriority,
          title: 'Open cases by priority',
          type: 'GRAPH',
          objectUniversalIdentifier: SUPPORT_CASE_UNIVERSAL_IDENTIFIER,
          position: grid(2, 0, 6, 6),
          configuration: {
            configurationType: 'BAR_CHART',
            aggregateFieldMetadataUniversalIdentifier: F.subject,
            aggregateOperation: AggregateOperations.COUNT,
            primaryAxisGroupByFieldMetadataUniversalIdentifier: F.priority,
            filter: { recordFilters: [OPEN_FILTER] },
            ...BAR,
          },
        },
        {
          universalIdentifier: W.byStatus,
          title: 'Cases by status',
          type: 'GRAPH',
          objectUniversalIdentifier: SUPPORT_CASE_UNIVERSAL_IDENTIFIER,
          position: grid(2, 6, 6, 6),
          configuration: {
            configurationType: 'BAR_CHART',
            aggregateFieldMetadataUniversalIdentifier: F.subject,
            aggregateOperation: AggregateOperations.COUNT,
            primaryAxisGroupByFieldMetadataUniversalIdentifier: F.status,
            ...BAR,
          },
        },
      ],
    },
  ],
});
