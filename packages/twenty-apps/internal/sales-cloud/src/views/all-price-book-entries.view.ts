import { defineView, ViewType } from 'twenty-sdk/define';

import {
  ALL_PRICE_BOOK_ENTRIES_VIEW_FIELD_UNIVERSAL_IDENTIFIERS,
  ALL_PRICE_BOOK_ENTRIES_VIEW_UNIVERSAL_IDENTIFIER,
  PRICE_BOOK_ENTRY_FIELD_UNIVERSAL_IDENTIFIERS,
  PRICE_BOOK_ENTRY_UNIVERSAL_IDENTIFIER,
  QUOTE_RELATION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/quote-identifiers';

const COLUMNS = [
  { field: PRICE_BOOK_ENTRY_FIELD_UNIVERSAL_IDENTIFIERS.name, size: 240 },
  { field: QUOTE_RELATION_UNIVERSAL_IDENTIFIERS.productOnEntry, size: 180 },
  { field: QUOTE_RELATION_UNIVERSAL_IDENTIFIERS.priceBookOnEntry, size: 180 },
  { field: PRICE_BOOK_ENTRY_FIELD_UNIVERSAL_IDENTIFIERS.unitPrice, size: 140 },
];

export default defineView({
  universalIdentifier: ALL_PRICE_BOOK_ENTRIES_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'All Price Book Entries',
  objectUniversalIdentifier: PRICE_BOOK_ENTRY_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconList',
  position: 0,
  fields: COLUMNS.map(({ field, size }, index) => ({
    universalIdentifier: ALL_PRICE_BOOK_ENTRIES_VIEW_FIELD_UNIVERSAL_IDENTIFIERS[index],
    fieldMetadataUniversalIdentifier: field,
    position: index,
    isVisible: true,
    size,
  })),
});
