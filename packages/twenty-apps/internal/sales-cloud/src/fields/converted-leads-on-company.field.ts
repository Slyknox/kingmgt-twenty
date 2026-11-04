import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  LEAD_RELATION_UNIVERSAL_IDENTIFIERS,
  LEAD_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: LEAD_RELATION_UNIVERSAL_IDENTIFIERS.convertedLeadsOnCompany,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.RELATION,
  name: 'convertedFromLeads',
  label: 'Converted from leads',
  icon: 'IconTargetArrow',
  relationTargetObjectMetadataUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    LEAD_RELATION_UNIVERSAL_IDENTIFIERS.convertedCompanyOnLead,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
