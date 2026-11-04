import { defineView, ViewType } from 'twenty-sdk/define';

import {
  ALL_PRODUCTS_VIEW_FIELD_UNIVERSAL_IDENTIFIERS,
  ALL_PRODUCTS_VIEW_UNIVERSAL_IDENTIFIER,
  PRODUCT_FIELD_UNIVERSAL_IDENTIFIERS,
  PRODUCT_UNIVERSAL_IDENTIFIER,
} from 'src/constants/quote-identifiers';

const COLUMNS = [
  { field: PRODUCT_FIELD_UNIVERSAL_IDENTIFIERS.name, size: 220 },
  { field: PRODUCT_FIELD_UNIVERSAL_IDENTIFIERS.productCode, size: 140 },
  { field: PRODUCT_FIELD_UNIVERSAL_IDENTIFIERS.family, size: 140 },
  { field: PRODUCT_FIELD_UNIVERSAL_IDENTIFIERS.listPrice, size: 140 },
  { field: PRODUCT_FIELD_UNIVERSAL_IDENTIFIERS.isActive, size: 100 },
  { field: PRODUCT_FIELD_UNIVERSAL_IDENTIFIERS.description, size: 240 },
];

export default defineView({
  universalIdentifier: ALL_PRODUCTS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'All Products',
  objectUniversalIdentifier: PRODUCT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconList',
  position: 0,
  fields: COLUMNS.map(({ field, size }, index) => ({
    universalIdentifier: ALL_PRODUCTS_VIEW_FIELD_UNIVERSAL_IDENTIFIERS[index],
    fieldMetadataUniversalIdentifier: field,
    position: index,
    isVisible: true,
    size,
  })),
});
