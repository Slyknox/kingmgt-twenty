import {
  defineField,
  FieldType,
  RelationType,
} from 'twenty-sdk/define';

import {
  PRICE_BOOK_ENTRY_UNIVERSAL_IDENTIFIER,
  PRICE_BOOK_UNIVERSAL_IDENTIFIER,
  QUOTE_RELATION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/quote-identifiers';

export default defineField({
  universalIdentifier: QUOTE_RELATION_UNIVERSAL_IDENTIFIERS.entriesOnPriceBook,
  objectUniversalIdentifier: PRICE_BOOK_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'entries',
  label: 'Entries',
  icon: 'IconTag',
  relationTargetObjectMetadataUniversalIdentifier: PRICE_BOOK_ENTRY_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    QUOTE_RELATION_UNIVERSAL_IDENTIFIERS.priceBookOnEntry,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
