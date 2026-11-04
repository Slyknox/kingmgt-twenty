import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  LEAD_RELATION_UNIVERSAL_IDENTIFIERS,
  LEAD_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: LEAD_RELATION_UNIVERSAL_IDENTIFIERS.convertedCompanyOnLead,
  objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'convertedCompany',
  label: 'Converted company',
  icon: 'IconBuildingSkyscraper',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    LEAD_RELATION_UNIVERSAL_IDENTIFIERS.convertedLeadsOnCompany,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'convertedCompanyId',
  },
});
