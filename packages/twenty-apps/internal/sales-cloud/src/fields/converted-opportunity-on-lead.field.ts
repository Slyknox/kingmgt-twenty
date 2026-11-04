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
  universalIdentifier: LEAD_RELATION_UNIVERSAL_IDENTIFIERS.convertedOpportunityOnLead,
  objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'convertedOpportunity',
  label: 'Converted opportunity',
  icon: 'IconTargetArrow',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    LEAD_RELATION_UNIVERSAL_IDENTIFIERS.convertedLeadsOnOpportunity,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'convertedOpportunityId',
  },
});
