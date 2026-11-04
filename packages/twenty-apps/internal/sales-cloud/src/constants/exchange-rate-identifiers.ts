// Universal identifiers are permanent: once installed in a workspace they key
// the metadata, so never regenerate or reuse one.

export const EXCHANGE_RATE_UNIVERSAL_IDENTIFIER = 'fc9c04df-97fe-4a59-8cde-25235912b10f';

export const EXCHANGE_RATE_FIELD_UNIVERSAL_IDENTIFIERS = {
  currencyCode: 'df0bd7fc-8b35-404d-98af-498095b140ed',
  unitsPerCorporateUnit: '136c251a-cb95-47b6-85d2-f3aafc72d4c9',
  isCorporate: '374863c9-7f0e-4889-b020-67534d94a076',
  autoUpdate: '65ccebb0-af3f-4a54-8fba-1b5b31eadeba',
  rateUpdatedAt: '094656fb-104e-4914-807a-08ab2dbef531',
} as const;

export const ALL_EXCHANGE_RATES_VIEW_UNIVERSAL_IDENTIFIER = '4f4263f5-e9ff-4895-8657-04e57eb05710';
export const ALL_EXCHANGE_RATES_VIEW_FIELD_UNIVERSAL_IDENTIFIERS = [
  '8bafa06a-6f37-4535-aa38-a34379f68f11',
  '3cdaa40b-35fb-43ee-9e73-58695327bff0',
  'e53fec70-2154-42a2-9a07-ab31a88210e9',
  'f5f1f431-d39c-4bb4-8c60-2831487a0f15',
  '2bcf89bc-3cf9-4ab1-9f4b-a9dfa8a0af62',
] as const;

export const EXCHANGE_RATES_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER = '7e963999-ff1b-459b-ab6b-d4fb1a697b8b';

export const EXCHANGE_RATE_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIERS = {
  onExchangeRateChanged: 'c3ba5fdf-c43e-4352-b634-5c969412d0ef',
  syncEcbRates: 'd239e548-068e-4967-a85e-4f440ecf096f',
} as const;

// App setting, injected into process.env on every run.
export const ECB_RATES_ENABLED_ENV_VAR_NAME = 'SALES_CLOUD_ECB_RATES_ENABLED';
