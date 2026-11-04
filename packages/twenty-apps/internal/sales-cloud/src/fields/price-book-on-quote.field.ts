import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';

import {
  PRICE_BOOK_UNIVERSAL_IDENTIFIER,
  QUOTE_RELATION_UNIVERSAL_IDENTIFIERS,
  QUOTE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/quote-identifiers';

export default defineField({
  universalIdentifier: QUOTE_RELATION_UNIVERSAL_IDENTIFIERS.priceBookOnQuote,
  objectUniversalIdentifier: QUOTE_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'priceBook',
  label: 'Price book',
  icon: 'IconBook',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier: PRICE_BOOK_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    QUOTE_RELATION_UNIVERSAL_IDENTIFIERS.quotesOnPriceBook,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'priceBookId',
  },
});
