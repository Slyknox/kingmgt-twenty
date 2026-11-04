import { defineView, ViewType } from 'twenty-sdk/define';

import {
  ALL_EXCHANGE_RATES_VIEW_FIELD_UNIVERSAL_IDENTIFIERS as VIEW_FIELD_IDS,
  ALL_EXCHANGE_RATES_VIEW_UNIVERSAL_IDENTIFIER,
  EXCHANGE_RATE_FIELD_UNIVERSAL_IDENTIFIERS as F,
  EXCHANGE_RATE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/exchange-rate-identifiers';

const COLUMNS = [
  { field: F.currencyCode, size: 120 },
  { field: F.unitsPerCorporateUnit, size: 140 },
  { field: F.isCorporate, size: 110 },
  { field: F.autoUpdate, size: 120 },
  { field: F.rateUpdatedAt, size: 170 },
];

export default defineView({
  universalIdentifier: ALL_EXCHANGE_RATES_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'All Exchange Rates',
  objectUniversalIdentifier: EXCHANGE_RATE_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconList',
  position: 0,
  fields: COLUMNS.map(({ field, size }, index) => ({
    universalIdentifier: VIEW_FIELD_IDS[index],
    fieldMetadataUniversalIdentifier: field,
    position: index,
    isVisible: true,
    size,
  })),
});
