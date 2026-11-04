import { defineObject, FieldType } from 'twenty-sdk/define';

import {
  EXCHANGE_RATE_FIELD_UNIVERSAL_IDENTIFIERS as F,
  EXCHANGE_RATE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/exchange-rate-identifiers';

// Salesforce-style "Manage Currencies": one row per currency, each priced
// against the corporate currency (the row marked Corporate, rate 1).
export default defineObject({
  universalIdentifier: EXCHANGE_RATE_UNIVERSAL_IDENTIFIER,
  nameSingular: 'exchangeRate',
  namePlural: 'exchangeRates',
  labelSingular: 'Exchange rate',
  labelPlural: 'Exchange rates',
  description:
    'Rates used to add up amounts in different currencies. Mark one currency as Corporate.',
  icon: 'IconCurrencyDollar',
  labelIdentifierFieldMetadataUniversalIdentifier: F.currencyCode,
  fields: [
    { universalIdentifier: F.currencyCode, type: FieldType.TEXT, name: 'currencyCode', label: 'Currency', description: 'Three-letter code, e.g. EUR', icon: 'IconCurrency' },
    {
      universalIdentifier: F.unitsPerCorporateUnit,
      type: FieldType.NUMBER,
      name: 'unitsPerCorporateUnit',
      label: 'Rate',
      description: 'How many of this currency equal 1 of the corporate currency. The corporate currency itself is 1.',
      icon: 'IconArrowsExchange',
      isNullable: true,
      universalSettings: { dataType: 'float', decimals: 6 },
    },
    { universalIdentifier: F.isCorporate, type: FieldType.BOOLEAN, name: 'isCorporate', label: 'Corporate', description: 'The currency every rate is measured against. Mark exactly one.', icon: 'IconBuildingBank', defaultValue: false },
    { universalIdentifier: F.autoUpdate, type: FieldType.BOOLEAN, name: 'autoUpdate', label: 'Update daily', description: 'Let the daily ECB sync update this rate, when the sync is switched on', icon: 'IconRefresh', defaultValue: true },
    { universalIdentifier: F.rateUpdatedAt, type: FieldType.DATE_TIME, name: 'rateUpdatedAt', label: 'Rate updated at', icon: 'IconClock', isNullable: true },
  ],
});
