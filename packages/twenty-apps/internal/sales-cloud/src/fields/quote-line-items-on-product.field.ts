import {
  defineField,
  FieldType,
  RelationType,
} from 'twenty-sdk/define';

import {
  PRODUCT_UNIVERSAL_IDENTIFIER,
  QUOTE_LINE_ITEM_UNIVERSAL_IDENTIFIER,
  QUOTE_RELATION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/quote-identifiers';

export default defineField({
  universalIdentifier: QUOTE_RELATION_UNIVERSAL_IDENTIFIERS.quoteLineItemsOnProduct,
  objectUniversalIdentifier: PRODUCT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'quoteLineItems',
  label: 'Quote line items',
  icon: 'IconListDetails',
  relationTargetObjectMetadataUniversalIdentifier: QUOTE_LINE_ITEM_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    QUOTE_RELATION_UNIVERSAL_IDENTIFIERS.productOnLineItem,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
