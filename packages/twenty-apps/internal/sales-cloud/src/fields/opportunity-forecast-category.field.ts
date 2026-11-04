import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { FORECAST_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/campaign-forecast-identifiers';
import { FORECAST_CATEGORY_OPTIONS } from 'src/constants/forecast-options';

export default defineField({
  universalIdentifier: FORECAST_FIELD_UNIVERSAL_IDENTIFIERS.forecastCategory,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.SELECT,
  name: 'forecastCategory',
  label: 'Forecast category',
  description:
    'Set from the stage when the stage changes; change it by hand to override. Omitted leaves the forecast.',
  icon: 'IconChartArrows',
  isNullable: true,
  options: FORECAST_CATEGORY_OPTIONS,
});
