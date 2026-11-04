import { defineView, ViewType } from 'twenty-sdk/define';

import {
  ALL_QUOTE_LINE_ITEMS_VIEW_FIELD_UNIVERSAL_IDENTIFIERS,
  ALL_QUOTE_LINE_ITEMS_VIEW_UNIVERSAL_IDENTIFIER,
  QUOTE_LINE_ITEM_FIELD_UNIVERSAL_IDENTIFIERS,
  QUOTE_LINE_ITEM_UNIVERSAL_IDENTIFIER,
  QUOTE_RELATION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/quote-identifiers';

const COLUMNS = [
  { field: QUOTE_LINE_ITEM_FIELD_UNIVERSAL_IDENTIFIERS.name, size: 220 },
  { field: QUOTE_RELATION_UNIVERSAL_IDENTIFIERS.quoteOnLineItem, size: 200 },
  { field: QUOTE_RELATION_UNIVERSAL_IDENTIFIERS.productOnLineItem, size: 180 },
  { field: QUOTE_LINE_ITEM_FIELD_UNIVERSAL_IDENTIFIERS.quantity, size: 100 },
  { field: QUOTE_LINE_ITEM_FIELD_UNIVERSAL_IDENTIFIERS.unitPrice, size: 130 },
  { field: QUOTE_LINE_ITEM_FIELD_UNIVERSAL_IDENTIFIERS.discountPercent, size: 110 },
  { field: QUOTE_LINE_ITEM_FIELD_UNIVERSAL_IDENTIFIERS.total, size: 130 },
];

export default defineView({
  universalIdentifier: ALL_QUOTE_LINE_ITEMS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'All Quote Line Items',
  objectUniversalIdentifier: QUOTE_LINE_ITEM_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconList',
  position: 0,
  fields: COLUMNS.map(({ field, size }, index) => ({
    universalIdentifier: ALL_QUOTE_LINE_ITEMS_VIEW_FIELD_UNIVERSAL_IDENTIFIERS[index],
    fieldMetadataUniversalIdentifier: field,
    position: index,
    isVisible: true,
    size,
  })),
});
