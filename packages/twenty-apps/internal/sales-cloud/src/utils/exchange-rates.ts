import { fetchAll } from 'src/utils/fetch-all';
import { type CrmClient } from 'src/utils/lead-conversion-types';

export type ExchangeRates = {
  corporateCurrency: string | null;
  // Units of each currency per 1 corporate unit; the corporate currency is 1.
  unitsPerCorporateUnit: Map<string, number>;
};

export const NO_EXCHANGE_RATES: ExchangeRates = {
  corporateCurrency: null,
  unitsPerCorporateUnit: new Map(),
};

export type ExchangeRateRecord = {
  id?: string;
  currencyCode?: string | null;
  unitsPerCorporateUnit?: number | null;
  isCorporate?: boolean | null;
  autoUpdate?: boolean | null;
};

export const normalizeCurrencyCode = (code?: string | null) =>
  (code ?? '').trim().toUpperCase();

// With no corporate currency there is nothing to convert through, so every
// amount stays in its own currency, as before rates existed.
export const buildExchangeRates = (rows: ExchangeRateRecord[]): ExchangeRates => {
  const corporate = rows.find((row) => row.isCorporate && normalizeCurrencyCode(row.currencyCode));

  if (!corporate) {
    return NO_EXCHANGE_RATES;
  }

  const corporateCurrency = normalizeCurrencyCode(corporate.currencyCode);
  const unitsPerCorporateUnit = new Map<string, number>([[corporateCurrency, 1]]);

  for (const row of rows) {
    const code = normalizeCurrencyCode(row.currencyCode);
    const rate = row.unitsPerCorporateUnit;

    if (code && code !== corporateCurrency && typeof rate === 'number' && Number.isFinite(rate) && rate > 0) {
      unitsPerCorporateUnit.set(code, rate);
    }
  }

  return { corporateCurrency, unitsPerCorporateUnit };
};

// Returns null when either currency has no rate, so the caller can leave the
// amount out and say so rather than guess.
export const convertMicros = (
  amountMicros: number,
  fromCurrency: string | null | undefined,
  toCurrency: string,
  rates: ExchangeRates,
): number | null => {
  const from = normalizeCurrencyCode(fromCurrency);
  const to = normalizeCurrencyCode(toCurrency);

  if (from === to) {
    return amountMicros;
  }

  const fromRate = rates.unitsPerCorporateUnit.get(from);
  const toRate = rates.unitsPerCorporateUnit.get(to);

  if (fromRate === undefined || toRate === undefined) {
    return null;
  }

  return Math.round((amountMicros / fromRate) * toRate);
};

export const loadExchangeRates = async (client: CrmClient): Promise<ExchangeRates> =>
  buildExchangeRates(
    await fetchAll<ExchangeRateRecord>(client, 'exchangeRates', undefined, {
      currencyCode: true,
      unitsPerCorporateUnit: true,
      isCorporate: true,
    }),
  );
