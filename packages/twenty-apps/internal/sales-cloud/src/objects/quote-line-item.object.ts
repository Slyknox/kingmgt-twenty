import { defineObject, FieldType } from 'twenty-sdk/define';

import {
  QUOTE_LINE_ITEM_FIELD_UNIVERSAL_IDENTIFIERS as F,
  QUOTE_LINE_ITEM_UNIVERSAL_IDENTIFIER,
} from 'src/constants/quote-identifiers';

export default defineObject({
  universalIdentifier: QUOTE_LINE_ITEM_UNIVERSAL_IDENTIFIER,
  nameSingular: 'quoteLineItem',
  namePlural: 'quoteLineItems',
  labelSingular: 'Quote line item',
  labelPlural: 'Quote line items',
  description:
    "A product on a quote. Picking a product fills in its price from the quote's price book.",
  icon: 'IconListDetails',
  labelIdentifierFieldMetadataUniversalIdentifier: F.name,
  fields: [
    { universalIdentifier: F.name, type: FieldType.TEXT, name: 'name', label: 'Name', description: "Filled in with the product's name when left empty", icon: 'IconAbc', isNullable: true },
    { universalIdentifier: F.quantity, type: FieldType.NUMBER, name: 'quantity', label: 'Quantity', description: 'Empty counts as 1', icon: 'IconHash', isNullable: true },
    { universalIdentifier: F.unitPrice, type: FieldType.CURRENCY, name: 'unitPrice', label: 'Unit price', description: 'Set from the price book when the product is picked; change it to override', icon: 'IconTag', isNullable: true },
    { universalIdentifier: F.discountPercent, type: FieldType.NUMBER, name: 'discountPercent', label: 'Discount %', icon: 'IconPercentage', isNullable: true },
    { universalIdentifier: F.subtotal, type: FieldType.CURRENCY, name: 'subtotal', label: 'Subtotal', description: 'Quantity × unit price. Calculated.', icon: 'IconReceipt', isNullable: true },
    { universalIdentifier: F.total, type: FieldType.CURRENCY, name: 'total', label: 'Total', description: 'Subtotal less discount. Calculated.', icon: 'IconCash', isNullable: true },
  ],
});
