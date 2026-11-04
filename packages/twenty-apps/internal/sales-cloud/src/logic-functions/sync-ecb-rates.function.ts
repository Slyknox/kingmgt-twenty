import { defineLogicFunction } from 'twenty-sdk/define';

import {
  ECB_RATES_ENABLED_ENV_VAR_NAME,
  EXCHANGE_RATE_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIERS as IDS,
} from 'src/constants/exchange-rate-identifiers';
import { appClient } from 'src/utils/app-client';
import { ECB_DAILY_RATES_URL, syncEcbRates } from 'src/utils/ecb-rates';

const fetchEcbXml = async () => {
  const response = await fetch(ECB_DAILY_RATES_URL);

  if (!response.ok) {
    throw new Error(`ECB rates request failed with status ${response.status}`);
  }

  return response.text();
};

// Off unless the workspace turns it on: it is the only part of the app that
// calls out to the internet.
const handler = async () => {
  if (process.env[ECB_RATES_ENABLED_ENV_VAR_NAME] !== 'true') {
    return { skipped: true };
  }

  return { updated: await syncEcbRates(appClient(), fetchEcbXml) };
};

export default defineLogicFunction({
  universalIdentifier: IDS.syncEcbRates,
  name: 'sync-ecb-rates',
  description:
    "Updates exchange rates from the European Central Bank's daily reference rates, when switched on.",
  timeoutSeconds: 120,
  // Weekdays after the ECB publishes (around 16:00 CET).
  cronTriggerSettings: { pattern: '41 15 * * 1-5' },
  handler,
});
