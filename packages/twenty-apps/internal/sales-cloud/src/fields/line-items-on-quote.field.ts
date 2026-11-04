import {
  defineField,
  FieldType,
  RelationType,
} from 'twenty-sdk/define';

import {
  QUOTE_LINE_ITEM_UNIVERSAL_IDENTIFIER,
  QUOTE_RELATION_UNIVERSAL_IDENTIFIERS,
  QUOTE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/quote-identifiers';

export default defineField({
  universalIdentifier: QUOTE_RELATION_UNIVERSAL_IDENTIFIERS.lineItemsOnQuote,
  objectUniversalIdentifier: QUOTE_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'lineItems',
  label: 'Line items',
  icon: 'IconListDetails',
  relationTargetObjectMetadataUniversalIdentifier: QUOTE_LINE_ITEM_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    QUOTE_RELATION_UNIVERSAL_IDENTIFIERS.quoteOnLineItem,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
