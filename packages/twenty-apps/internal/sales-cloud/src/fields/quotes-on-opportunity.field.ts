import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  QUOTE_RELATION_UNIVERSAL_IDENTIFIERS,
  QUOTE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/quote-identifiers';

export default defineField({
  universalIdentifier: QUOTE_RELATION_UNIVERSAL_IDENTIFIERS.quotesOnOpportunity,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  type: FieldType.RELATION,
  name: 'quotes',
  label: 'Quotes',
  icon: 'IconFileInvoice',
  relationTargetObjectMetadataUniversalIdentifier: QUOTE_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    QUOTE_RELATION_UNIVERSAL_IDENTIFIERS.opportunityOnQuote,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
