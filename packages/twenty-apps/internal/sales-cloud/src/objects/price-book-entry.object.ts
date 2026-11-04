import { defineObject, FieldType } from 'twenty-sdk/define';

import {
  PRICE_BOOK_ENTRY_FIELD_UNIVERSAL_IDENTIFIERS as F,
  PRICE_BOOK_ENTRY_UNIVERSAL_IDENTIFIER,
} from 'src/constants/quote-identifiers';

export default defineObject({
  universalIdentifier: PRICE_BOOK_ENTRY_UNIVERSAL_IDENTIFIER,
  nameSingular: 'priceBookEntry',
  namePlural: 'priceBookEntries',
  labelSingular: 'Price book entry',
  labelPlural: 'Price book entries',
  description: "A product's price in one price book.",
  icon: 'IconTag',
  labelIdentifierFieldMetadataUniversalIdentifier: F.name,
  fields: [
    { universalIdentifier: F.name, type: FieldType.TEXT, name: 'name', label: 'Name', description: 'Filled in as "<product> - <price book>"', icon: 'IconAbc', isNullable: true },
    { universalIdentifier: F.unitPrice, type: FieldType.CURRENCY, name: 'unitPrice', label: 'Unit price', icon: 'IconTag', isNullable: true },
    { universalIdentifier: F.isActive, type: FieldType.BOOLEAN, name: 'isActive', label: 'Active', icon: 'IconToggleRight', defaultValue: true, isNullable: false },
  ],
});
