import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { FORECAST_FIELD_UNIVERSAL_IDENTIFIERS } from 'src/constants/campaign-forecast-identifiers';

export default defineField({
  universalIdentifier: FORECAST_FIELD_UNIVERSAL_IDENTIFIERS.probability,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.NUMBER,
  name: 'probability',
  label: 'Probability %',
  description:
    'Chance of closing, 0 to 100. Set from the stage when the stage changes; change it by hand to override.',
  icon: 'IconPercentage',
  isNullable: true,
});
