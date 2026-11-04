import { defineView, ViewType } from 'twenty-sdk/define';

import {
  ALL_QUOTES_VIEW_FIELD_UNIVERSAL_IDENTIFIERS,
  ALL_QUOTES_VIEW_UNIVERSAL_IDENTIFIER,
  QUOTE_FIELD_UNIVERSAL_IDENTIFIERS,
  QUOTE_RELATION_UNIVERSAL_IDENTIFIERS,
  QUOTE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/quote-identifiers';

const COLUMNS = [
  { field: QUOTE_FIELD_UNIVERSAL_IDENTIFIERS.name, size: 220 },
  { field: QUOTE_FIELD_UNIVERSAL_IDENTIFIERS.status, size: 120 },
  { field: QUOTE_RELATION_UNIVERSAL_IDENTIFIERS.opportunityOnQuote, size: 200 },
  { field: QUOTE_RELATION_UNIVERSAL_IDENTIFIERS.priceBookOnQuote, size: 160 },
  { field: QUOTE_FIELD_UNIVERSAL_IDENTIFIERS.total, size: 140 },
  { field: QUOTE_FIELD_UNIVERSAL_IDENTIFIERS.expirationDate, size: 130 },
  { field: QUOTE_FIELD_UNIVERSAL_IDENTIFIERS.syncToOpportunity, size: 120 },
  { field: QUOTE_FIELD_UNIVERSAL_IDENTIFIERS.pricingWarning, size: 240 },
];

export default defineView({
  universalIdentifier: ALL_QUOTES_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'All Quotes',
  objectUniversalIdentifier: QUOTE_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconList',
  position: 0,
  fields: COLUMNS.map(({ field, size }, index) => ({
    universalIdentifier: ALL_QUOTES_VIEW_FIELD_UNIVERSAL_IDENTIFIERS[index],
    fieldMetadataUniversalIdentifier: field,
    position: index,
    isVisible: true,
    size,
  })),
});
