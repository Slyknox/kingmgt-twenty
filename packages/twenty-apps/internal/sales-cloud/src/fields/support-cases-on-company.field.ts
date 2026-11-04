import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  SUPPORT_CASE_RELATION_UNIVERSAL_IDENTIFIERS,
  SUPPORT_CASE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/support-case-identifiers';

export default defineField({
  universalIdentifier: SUPPORT_CASE_RELATION_UNIVERSAL_IDENTIFIERS.supportCasesOnCompany,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.RELATION,
  name: 'supportCases',
  label: 'Cases',
  icon: 'IconLifebuoy',
  relationTargetObjectMetadataUniversalIdentifier: SUPPORT_CASE_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    SUPPORT_CASE_RELATION_UNIVERSAL_IDENTIFIERS.companyOnCase,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
