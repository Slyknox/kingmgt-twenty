import { defineObject, FieldType } from 'twenty-sdk/define';

import {
  QUOTE_FIELD_UNIVERSAL_IDENTIFIERS as F,
  QUOTE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/quote-identifiers';
import { QUOTE_STATUS_OPTIONS, QuoteStatus } from 'src/constants/quote-options';

const CALCULATED = 'Calculated from the line items; manual edits are overwritten.';

export default defineObject({
  universalIdentifier: QUOTE_UNIVERSAL_IDENTIFIER,
  nameSingular: 'quote',
  namePlural: 'quotes',
  labelSingular: 'Quote',
  labelPlural: 'Quotes',
  description: 'Priced line items offered for an opportunity.',
  icon: 'IconFileInvoice',
  labelIdentifierFieldMetadataUniversalIdentifier: F.name,
  fields: [
    { universalIdentifier: F.name, type: FieldType.TEXT, name: 'name', label: 'Name', icon: 'IconAbc' },
    {
      universalIdentifier: F.status,
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      icon: 'IconProgress',
      defaultValue: `'${QuoteStatus.DRAFT}'`,
      options: QUOTE_STATUS_OPTIONS,
    },
    { universalIdentifier: F.expirationDate, type: FieldType.DATE, name: 'expirationDate', label: 'Expiration date', icon: 'IconCalendarDue', isNullable: true },
    { universalIdentifier: F.syncToOpportunity, type: FieldType.BOOLEAN, name: 'syncToOpportunity', label: 'Sync to opportunity', description: "Keeps the opportunity's amount equal to this quote's total. Only one quote per opportunity syncs.", icon: 'IconRefresh', defaultValue: false, isNullable: false },
    { universalIdentifier: F.subtotal, type: FieldType.CURRENCY, name: 'subtotal', label: 'Subtotal', description: `Before discounts. ${CALCULATED}`, icon: 'IconReceipt', isNullable: true },
    { universalIdentifier: F.discountTotal, type: FieldType.CURRENCY, name: 'discountTotal', label: 'Discount', description: CALCULATED, icon: 'IconDiscount', isNullable: true },
    { universalIdentifier: F.total, type: FieldType.CURRENCY, name: 'total', label: 'Total', description: CALCULATED, icon: 'IconCash', isNullable: true },
    { universalIdentifier: F.lineItemCount, type: FieldType.NUMBER, name: 'lineItemCount', label: 'Line items', description: CALCULATED, icon: 'IconList', isNullable: true },
    { universalIdentifier: F.pricingWarning, type: FieldType.TEXT, name: 'pricingWarning', label: 'Pricing warning', description: 'Lines left out of the totals, and why', icon: 'IconAlertTriangle', isNullable: true },
    { universalIdentifier: F.description, type: FieldType.TEXT, name: 'description', label: 'Description', icon: 'IconNotes', isNullable: true },
  ],
});
