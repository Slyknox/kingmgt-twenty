import { defineView, ViewType } from 'twenty-sdk/define';

import {
  ALL_PRICE_BOOKS_VIEW_FIELD_UNIVERSAL_IDENTIFIERS,
  ALL_PRICE_BOOKS_VIEW_UNIVERSAL_IDENTIFIER,
  PRICE_BOOK_FIELD_UNIVERSAL_IDENTIFIERS,
  PRICE_BOOK_UNIVERSAL_IDENTIFIER,
} from 'src/constants/quote-identifiers';

const COLUMNS = [
  { field: PRICE_BOOK_FIELD_UNIVERSAL_IDENTIFIERS.name, size: 220 },
  { field: PRICE_BOOK_FIELD_UNIVERSAL_IDENTIFIERS.isActive, size: 100 },
  { field: PRICE_BOOK_FIELD_UNIVERSAL_IDENTIFIERS.description, size: 280 },
];

export default defineView({
  universalIdentifier: ALL_PRICE_BOOKS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'All Price Books',
  objectUniversalIdentifier: PRICE_BOOK_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconList',
  position: 0,
  fields: COLUMNS.map(({ field, size }, index) => ({
    universalIdentifier: ALL_PRICE_BOOKS_VIEW_FIELD_UNIVERSAL_IDENTIFIERS[index],
    fieldMetadataUniversalIdentifier: field,
    position: index,
    isVisible: true,
    size,
  })),
});
