import {
  defineField,
  FieldType,
  RelationType,
} from 'twenty-sdk/define';

import {
  PRICE_BOOK_UNIVERSAL_IDENTIFIER,
  QUOTE_RELATION_UNIVERSAL_IDENTIFIERS,
  QUOTE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/quote-identifiers';

export default defineField({
  universalIdentifier: QUOTE_RELATION_UNIVERSAL_IDENTIFIERS.quotesOnPriceBook,
  objectUniversalIdentifier: PRICE_BOOK_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'quotes',
  label: 'Quotes',
  icon: 'IconFileInvoice',
  relationTargetObjectMetadataUniversalIdentifier: QUOTE_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    QUOTE_RELATION_UNIVERSAL_IDENTIFIERS.priceBookOnQuote,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
