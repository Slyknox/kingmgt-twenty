import { emptyCurrency, hasAmount, isSameCurrencyValue } from 'src/utils/currency';
import {
  convertMicros,
  type ExchangeRates,
  NO_EXCHANGE_RATES,
} from 'src/utils/exchange-rates';
import { type Currency } from 'src/utils/lead-conversion-types';

export type QuoteLineItemRecord = {
  id: string;
  name?: string | null;
  quoteId?: string | null;
  productId?: string | null;
  quantity?: number | null;
  unitPrice?: Currency | null;
  discountPercent?: number | null;
  subtotal?: Currency | null;
  total?: Currency | null;
};

export type LineItemChange = { productChanged: boolean; unitPriceSetByUser: boolean };

export type LinePricingContext = {
  productName?: string | null;
  // The active price book entry's price, else the product's list price.
  defaultUnitPrice?: Currency | null;
};

type Money = { amountMicros: number | null; currencyCode: string };

const clampPercent = (value: number) => Math.min(100, Math.max(0, value));

export const effectiveQuantity = (line: QuoteLineItemRecord) =>
  typeof line.quantity === 'number' ? line.quantity : 1;

export const effectiveDiscount = (line: QuoteLineItemRecord) =>
  typeof line.discountPercent === 'number' ? clampPercent(line.discountPercent) : 0;

export const computeLineAmounts = (
  line: QuoteLineItemRecord,
): { subtotal: Money; total: Money } => {
  if (!hasAmount(line.unitPrice)) {
    const empty = emptyCurrency(line.unitPrice?.currencyCode);

    return { subtotal: empty, total: empty };
  }

  const currencyCode = line.unitPrice.currencyCode || emptyCurrency().currencyCode;
  const subtotal = Math.round(effectiveQuantity(line) * line.unitPrice.amountMicros);
  const total = Math.round((subtotal * (100 - effectiveDiscount(line))) / 100);

  return {
    subtotal: { amountMicros: subtotal, currencyCode },
    total: { amountMicros: total, currencyCode },
  };
};

// Picking a product names the line after it and prices it from the quote's
// price book, unless the same edit typed a price. A line with no price yet
// always gets the default.
export const computeLineItemPatch = (
  line: QuoteLineItemRecord,
  change: LineItemChange,
  context: LinePricingContext,
): Record<string, unknown> | null => {
  const patch: Record<string, unknown> = {};
  const priced: QuoteLineItemRecord = { ...line };

  if (!line.name?.trim() && context.productName) {
    patch.name = context.productName;
  }

  const productChangedWithoutPrice =
    change.productChanged &&
    !change.unitPriceSetByUser &&
    !hasAmount(context.defaultUnitPrice) &&
    hasAmount(line.unitPrice);

  // A price belongs to the product it came from; a new product with no price
  // leaves the line unpriced (and flagged on the quote) rather than wrong.
  if (productChangedWithoutPrice) {
    patch.unitPrice = emptyCurrency(line.unitPrice?.currencyCode);
    priced.unitPrice = null;
  }

  const shouldApplyDefault =
    hasAmount(context.defaultUnitPrice) &&
    ((change.productChanged && !change.unitPriceSetByUser) || !hasAmount(line.unitPrice));

  if (shouldApplyDefault && !isSameCurrencyValue(context.defaultUnitPrice, line.unitPrice)) {
    patch.unitPrice = {
      amountMicros: context.defaultUnitPrice!.amountMicros,
      currencyCode: context.defaultUnitPrice!.currencyCode,
    };
    priced.unitPrice = context.defaultUnitPrice;
  }

  if (typeof line.discountPercent === 'number' && clampPercent(line.discountPercent) !== line.discountPercent) {
    patch.discountPercent = clampPercent(line.discountPercent);
  }

  const { subtotal, total } = computeLineAmounts(priced);

  if (!isSameCurrencyValue(subtotal, line.subtotal)) {
    patch.subtotal = subtotal;
  }

  if (!isSameCurrencyValue(total, line.total)) {
    patch.total = total;
  }

  return Object.keys(patch).length > 0 ? patch : null;
};

export type QuoteTotals = {
  subtotal: Money;
  discountTotal: Money;
  total: Money;
  lineItemCount: number;
  pricingWarning: string | null;
};

export type QuoteTotalsResult = {
  totals: QuoteTotals;
  // Lines whose amounts made it into the total; zero means the total says
  // nothing about the deal and must not overwrite its amount.
  includedLineCount: number;
};

const plural = (count: number, singular: string, pluralForm: string) =>
  `${count} ${count === 1 ? singular : pluralForm}`;

// Lines are summed in the currency most of them use. Others are converted
// through the exchange rates, or left out without one; the warning says which,
// so the total isn't trusted blindly.
export const computeQuoteTotals = (
  lines: QuoteLineItemRecord[],
  rates: ExchangeRates = NO_EXCHANGE_RATES,
): QuoteTotals => computeQuoteTotalsWithCount(lines, rates).totals;

export const computeQuoteTotalsWithCount = (
  lines: QuoteLineItemRecord[],
  rates: ExchangeRates = NO_EXCHANGE_RATES,
): QuoteTotalsResult => {
  const priced = lines.filter((line) => hasAmount(line.unitPrice));
  const countByCurrency = new Map<string, number>();

  for (const line of priced) {
    const code = line.unitPrice!.currencyCode || emptyCurrency().currencyCode;
    countByCurrency.set(code, (countByCurrency.get(code) ?? 0) + 1);
  }

  let currencyCode = emptyCurrency().currencyCode;
  let best = 0;

  for (const [code, count] of countByCurrency) {
    if (count > best) {
      currencyCode = code;
      best = count;
    }
  }

  let subtotal = 0;
  let total = 0;
  let otherCurrency = 0;
  const convertedFrom = new Set<string>();
  let converted = 0;
  let included = 0;

  for (const line of priced) {
    const amounts = computeLineAmounts(line);
    const lineCurrency = amounts.subtotal.currencyCode;
    const lineSubtotal = convertMicros(amounts.subtotal.amountMicros!, lineCurrency, currencyCode, rates);
    const lineTotal = convertMicros(amounts.total.amountMicros!, lineCurrency, currencyCode, rates);

    if (lineSubtotal === null || lineTotal === null) {
      otherCurrency++;
      continue;
    }

    if (lineCurrency !== currencyCode) {
      converted++;
      convertedFrom.add(lineCurrency);
    }

    subtotal += lineSubtotal;
    total += lineTotal;
    included++;
  }

  const unpriced = lines.length - priced.length;
  const warnings = [
    unpriced > 0
      ? `${plural(unpriced, 'line item has', 'line items have')} no price and ${unpriced === 1 ? 'is' : 'are'} left out.`
      : null,
    otherCurrency > 0
      ? `${plural(otherCurrency, 'line item is', 'line items are')} not in ${currencyCode}, ${otherCurrency === 1 ? 'has' : 'have'} no exchange rate and ${otherCurrency === 1 ? 'is' : 'are'} left out.`
      : null,
    converted > 0
      ? `${plural(converted, 'line item was', 'line items were')} converted to ${currencyCode} from ${[...convertedFrom].sort().join(', ')} at the stored exchange rates.`
      : null,
  ].filter(Boolean);

  return {
    totals: {
      subtotal: { amountMicros: subtotal, currencyCode },
      discountTotal: { amountMicros: subtotal - total, currencyCode },
      total: { amountMicros: total, currencyCode },
      lineItemCount: lines.length,
      pricingWarning: warnings.length > 0 ? warnings.join(' ') : null,
    },
    includedLineCount: included,
  };
};
