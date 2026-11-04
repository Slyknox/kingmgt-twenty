import { defineApplication, FieldType } from 'twenty-sdk/define';

import { ECB_RATES_ENABLED_ENV_VAR_NAME } from 'src/constants/exchange-rate-identifiers';
import { APPLICATION_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: 'Sales Cloud',
  description:
    'Salesforce-style sales and service for Twenty: leads, campaigns, forecasting, products and quotes, cases, and multiple currencies.',
  serverVariables: {
    [ECB_RATES_ENABLED_ENV_VAR_NAME]: {
      description:
        "Set to true to update exchange rates every weekday from the European Central Bank's reference rates. Off by default.",
      isSecret: false,
      type: FieldType.TEXT,
    },
  },
});
