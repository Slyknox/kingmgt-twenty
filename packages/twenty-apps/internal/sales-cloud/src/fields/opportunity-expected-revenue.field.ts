import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { FORECAST_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/campaign-forecast-identifiers';

export default defineField({
  universalIdentifier: FORECAST_FIELD_UNIVERSAL_IDENTIFIERS.expectedRevenue,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.CURRENCY,
  name: 'expectedRevenue',
  label: 'Expected revenue',
  description:
    'Amount × probability. Calculated by Sales Cloud; manual edits are overwritten.',
  icon: 'IconChartLine',
  isNullable: true,
});
