import {
  type ExchangeRateRecord,
  normalizeCurrencyCode,
} from 'src/utils/exchange-rates';
import { fetchAll } from 'src/utils/fetch-all';
import { type CrmClient } from 'src/utils/lead-conversion-types';

// The European Central Bank's free daily reference rates: units per 1 EUR.
export const ECB_DAILY_RATES_URL =
  'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml';

export const parseEcbRates = (xml: string): Map<string, number> => {
  const unitsPerEuro = new Map<string, number>([['EUR', 1]]);

  for (const match of xml.matchAll(/currency=['"]([A-Z]{3})['"]\s+rate=['"]([0-9.]+)['"]/g)) {
    const rate = Number(match[2]);

    if (Number.isFinite(rate) && rate > 0) {
      unitsPerEuro.set(match[1], rate);
    }
  }

  return unitsPerEuro;
};

// Re-bases the ECB's per-euro rates onto the workspace's corporate currency.
// Only rows that exist and allow updates change: the sync never adds
// currencies, and never touches a rate someone pinned by switching off
// "Update daily".
export const planEcbRateUpdates = (
  rows: ExchangeRateRecord[],
  unitsPerEuro: Map<string, number>,
): { id: string; unitsPerCorporateUnit: number }[] => {
  const corporate = rows.find((row) => row.isCorporate);
  const corporatePerEuro = unitsPerEuro.get(normalizeCurrencyCode(corporate?.currencyCode));

  if (!corporate || corporatePerEuro === undefined) {
    return [];
  }

  return rows.flatMap((row) => {
    const perEuro = unitsPerEuro.get(normalizeCurrencyCode(row.currencyCode));

    if (!row.id || row.isCorporate || row.autoUpdate === false || perEuro === undefined) {
      return [];
    }

    const unitsPerCorporateUnit = Number((perEuro / corporatePerEuro).toFixed(6));

    return unitsPerCorporateUnit === row.unitsPerCorporateUnit
      ? []
      : [{ id: row.id, unitsPerCorporateUnit }];
  });
};

export const syncEcbRates = async (
  client: CrmClient,
  fetchXml: () => Promise<string>,
  now: () => Date = () => new Date(),
): Promise<number> => {
  const rows = await fetchAll<ExchangeRateRecord>(client, 'exchangeRates', undefined, {
    id: true,
    currencyCode: true,
    unitsPerCorporateUnit: true,
    isCorporate: true,
    autoUpdate: true,
  });
  const updates = planEcbRateUpdates(rows, parseEcbRates(await fetchXml()));

  for (const { id, unitsPerCorporateUnit } of updates) {
    await client.mutation({
      updateExchangeRate: {
        __args: { id, data: { unitsPerCorporateUnit, rateUpdatedAt: now().toISOString() } },
        id: true,
      },
    });
  }

  return updates.length;
};
