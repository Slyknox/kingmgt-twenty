import { defineObject, FieldType } from 'twenty-sdk/define';

import {
  PRICE_BOOK_FIELD_UNIVERSAL_IDENTIFIERS as F,
  PRICE_BOOK_UNIVERSAL_IDENTIFIER,
} from 'src/constants/quote-identifiers';

export default defineObject({
  universalIdentifier: PRICE_BOOK_UNIVERSAL_IDENTIFIER,
  nameSingular: 'priceBook',
  namePlural: 'priceBooks',
  labelSingular: 'Price book',
  labelPlural: 'Price books',
  description: 'A list of product prices, e.g. per region or customer tier. A quote uses one.',
  icon: 'IconBook',
  labelIdentifierFieldMetadataUniversalIdentifier: F.name,
  fields: [
    { universalIdentifier: F.name, type: FieldType.TEXT, name: 'name', label: 'Name', icon: 'IconAbc' },
    { universalIdentifier: F.isActive, type: FieldType.BOOLEAN, name: 'isActive', label: 'Active', icon: 'IconToggleRight', defaultValue: true },
    { universalIdentifier: F.description, type: FieldType.TEXT, name: 'description', label: 'Description', icon: 'IconNotes', isNullable: true },
  ],
});
