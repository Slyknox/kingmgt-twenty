import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  QUOTE_RELATION_UNIVERSAL_IDENTIFIERS,
  QUOTE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/quote-identifiers';

export default defineField({
  universalIdentifier: QUOTE_RELATION_UNIVERSAL_IDENTIFIERS.opportunityOnQuote,
  objectUniversalIdentifier: QUOTE_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'opportunity',
  label: 'Opportunity',
  icon: 'IconTargetArrow',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    QUOTE_RELATION_UNIVERSAL_IDENTIFIERS.quotesOnOpportunity,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'opportunityId',
  },
});
