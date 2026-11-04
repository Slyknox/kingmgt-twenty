import {
  defineField,
  FieldType,
  RelationType,
} from 'twenty-sdk/define';

import {
  PRICE_BOOK_ENTRY_UNIVERSAL_IDENTIFIER,
  PRODUCT_UNIVERSAL_IDENTIFIER,
  QUOTE_RELATION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/quote-identifiers';

export default defineField({
  universalIdentifier: QUOTE_RELATION_UNIVERSAL_IDENTIFIERS.priceBookEntriesOnProduct,
  objectUniversalIdentifier: PRODUCT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'priceBookEntries',
  label: 'Price book entries',
  icon: 'IconTag',
  relationTargetObjectMetadataUniversalIdentifier: PRICE_BOOK_ENTRY_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    QUOTE_RELATION_UNIVERSAL_IDENTIFIERS.productOnEntry,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
