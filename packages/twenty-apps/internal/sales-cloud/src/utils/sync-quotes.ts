import {
  computeLineItemPatch,
  computeQuoteTotals,
  type LineItemChange,
  type QuoteLineItemRecord,
} from 'src/utils/compute-quote-pricing';
import { hasAmount, isSameCurrencyValue } from 'src/utils/currency';
import { loadExchangeRates } from 'src/utils/exchange-rates';
import { fetchAll } from 'src/utils/fetch-all';
import { groupBy } from 'src/utils/group-by';
import { type CrmClient, type Currency } from 'src/utils/lead-conversion-types';

const CURRENCY = { amountMicros: true, currencyCode: true };

const LINE_SELECTION = {
  id: true,
  name: true,
  quoteId: true,
  productId: true,
  quantity: true,
  unitPrice: CURRENCY,
  discountPercent: true,
  subtotal: CURRENCY,
  total: CURRENCY,
};

type QuoteRecord = {
  id: string;
  priceBookId?: string | null;
  opportunityId?: string | null;
  syncToOpportunity?: boolean | null;
  subtotal?: Currency | null;
  discountTotal?: Currency | null;
  total?: Currency | null;
  lineItemCount?: number | null;
  pricingWarning?: string | null;
};

type ProductRecord = { id: string; name?: string | null; listPrice?: Currency | null };

type EntryRecord = {
  priceBookId?: string | null;
  productId?: string | null;
  unitPrice?: Currency | null;
};

const fetchQuotes = (client: CrmClient, quoteIds: string[]) =>
  fetchAll<QuoteRecord>(client, 'quotes', { id: { in: quoteIds } }, {
    id: true,
    priceBookId: true,
    opportunityId: true,
    syncToOpportunity: true,
    subtotal: CURRENCY,
    discountTotal: CURRENCY,
    total: CURRENCY,
    lineItemCount: true,
    pricingWarning: true,
  });

const isUnchanged = (quote: QuoteRecord, totals: ReturnType<typeof computeQuoteTotals>) =>
  isSameCurrencyValue(quote.subtotal, totals.subtotal) &&
  isSameCurrencyValue(quote.discountTotal, totals.discountTotal) &&
  isSameCurrencyValue(quote.total, totals.total) &&
  quote.lineItemCount === totals.lineItemCount &&
  (quote.pricingWarning ?? null) === totals.pricingWarning;

// Sums each quote from its lines' quantities, prices and discounts (not from
// the lines' stored totals, which may not be written yet), then pushes the
// total of a syncing quote onto its opportunity.
export const recomputeQuotes = async (
  client: CrmClient,
  quoteIds: Iterable<string>,
): Promise<number> => {
  const ids = [...new Set(quoteIds)].filter(Boolean);

  if (ids.length === 0) {
    return 0;
  }

  const [quotes, lines, rates] = await Promise.all([
    fetchQuotes(client, ids),
    fetchAll<QuoteLineItemRecord>(client, 'quoteLineItems', { quoteId: { in: ids } }, LINE_SELECTION),
    loadExchangeRates(client),
  ]);
  const linesByQuoteId = groupBy(lines, (line) => line.quoteId);
  const syncedAmountByOpportunityId = new Map<string, Currency>();
  let updated = 0;

  for (const quote of quotes) {
    const totals = computeQuoteTotals(linesByQuoteId.get(quote.id) ?? [], rates);

    if (!isUnchanged(quote, totals)) {
      await client.mutation({
        updateQuote: { __args: { id: quote.id, data: totals }, id: true },
      });
      updated++;
    }

    if (quote.syncToOpportunity && quote.opportunityId) {
      syncedAmountByOpportunityId.set(quote.opportunityId, totals.total);
    }
  }

  await syncOpportunityAmounts(client, syncedAmountByOpportunityId);

  return updated;
};

const syncOpportunityAmounts = async (
  client: CrmClient,
  amountByOpportunityId: Map<string, Currency>,
) => {
  if (amountByOpportunityId.size === 0) {
    return;
  }

  const opportunities = await fetchAll<{ id: string; amount?: Currency | null }>(
    client,
    'opportunities',
    { id: { in: [...amountByOpportunityId.keys()] } },
    { id: true, amount: CURRENCY },
  );

  for (const opportunity of opportunities) {
    const amount = amountByOpportunityId.get(opportunity.id)!;

    if (hasAmount(amount) && !isSameCurrencyValue(amount, opportunity.amount)) {
      await client.mutation({
        updateOpportunity: { __args: { id: opportunity.id, data: { amount } }, id: true },
      });
    }
  }
};

// Like Salesforce, only one quote per opportunity syncs: switching it on for
// a quote switches it off for that opportunity's other quotes.
export const keepOneSyncingQuotePerOpportunity = async (
  client: CrmClient,
  newlySyncingQuoteIds: string[],
): Promise<void> => {
  if (newlySyncingQuoteIds.length === 0) {
    return;
  }

  const syncing = (await fetchQuotes(client, newlySyncingQuoteIds)).filter(
    (quote) => quote.syncToOpportunity && quote.opportunityId,
  );

  if (syncing.length === 0) {
    return;
  }

  const keepByOpportunityId = new Map(syncing.map((quote) => [quote.opportunityId!, quote.id]));
  const others = await fetchAll<QuoteRecord>(
    client,
    'quotes',
    { opportunityId: { in: [...keepByOpportunityId.keys()] }, syncToOpportunity: { eq: true } },
    { id: true, opportunityId: true },
  );

  for (const quote of others) {
    if (keepByOpportunityId.get(quote.opportunityId!) !== quote.id) {
      await client.mutation({
        updateQuote: { __args: { id: quote.id, data: { syncToOpportunity: false } }, id: true },
      });
    }
  }
};

type ProductPrices = {
  productById: Map<string, ProductRecord>;
  entryPrice: Map<string, Currency | null | undefined>;
};

// Looks up, for these products, their list prices and their active entries in
// these price books.
const loadProductPrices = async (
  client: CrmClient,
  productIds: string[],
  priceBookIds: string[],
): Promise<ProductPrices> => {
  const [products, entries] = await Promise.all([
    productIds.length > 0
      ? fetchAll<ProductRecord>(client, 'products', { id: { in: productIds } }, {
          id: true,
          name: true,
          listPrice: CURRENCY,
        })
      : Promise.resolve([] as ProductRecord[]),
    priceBookIds.length > 0 && productIds.length > 0
      ? fetchAll<EntryRecord>(
          client,
          'priceBookEntries',
          {
            priceBookId: { in: priceBookIds },
            productId: { in: productIds },
            isActive: { eq: true },
          },
          { priceBookId: true, productId: true, unitPrice: CURRENCY },
        )
      : Promise.resolve([] as EntryRecord[]),
  ]);

  return {
    productById: new Map(products.map((product) => [product.id, product])),
    entryPrice: new Map(
      entries.map((entry) => [`${entry.priceBookId}:${entry.productId}`, entry.unitPrice]),
    ),
  };
};

// The price book's active entry, else the product's list price.
const defaultPriceFor = (
  prices: ProductPrices,
  productId: string | null | undefined,
  priceBookId: string | null | undefined,
): Currency | null | undefined => {
  if (!productId) {
    return undefined;
  }

  const bookPrice = priceBookId ? prices.entryPrice.get(`${priceBookId}:${productId}`) : undefined;

  return hasAmount(bookPrice) ? bookPrice : prices.productById.get(productId)?.listPrice;
};

const unique = (values: (string | null | undefined)[]) =>
  [...new Set(values.filter(Boolean))] as string[];

// Names and prices the changed lines, then returns the quotes to recompute.
export const priceLineItems = async (
  client: CrmClient,
  changes: Map<string, LineItemChange>,
): Promise<string[]> => {
  if (changes.size === 0) {
    return [];
  }

  const lines = await fetchAll<QuoteLineItemRecord>(
    client,
    'quoteLineItems',
    { id: { in: [...changes.keys()] } },
    LINE_SELECTION,
  );
  const quoteIds = unique(lines.map((line) => line.quoteId));
  const quotes = quoteIds.length > 0 ? await fetchQuotes(client, quoteIds) : [];
  const priceBookIdByQuoteId = new Map(quotes.map((quote) => [quote.id, quote.priceBookId]));
  const prices = await loadProductPrices(
    client,
    unique(lines.map((line) => line.productId)),
    unique(quotes.map((quote) => quote.priceBookId)),
  );

  for (const line of lines) {
    const patch = computeLineItemPatch(line, changes.get(line.id)!, {
      productName: line.productId ? prices.productById.get(line.productId)?.name : undefined,
      defaultUnitPrice: defaultPriceFor(
        prices,
        line.productId,
        line.quoteId ? priceBookIdByQuoteId.get(line.quoteId) : undefined,
      ),
    });

    if (patch) {
      await client.mutation({
        updateQuoteLineItem: { __args: { id: line.id, data: patch }, id: true },
      });
    }
  }

  return quoteIds;
};

export type PriceBookChange = { quoteId: string; previousPriceBookId: string | null };

// When a quote moves to another price book, its lines take the new book's
// prices. A line whose price someone typed (one that matches neither the old
// book's price nor the list price) keeps it. Returns how many lines changed.
export const repriceQuoteLines = async (
  client: CrmClient,
  changes: PriceBookChange[],
): Promise<number> => {
  if (changes.length === 0) {
    return 0;
  }

  const quoteIds = unique(changes.map((change) => change.quoteId));
  const [quotes, lines] = await Promise.all([
    fetchQuotes(client, quoteIds),
    fetchAll<QuoteLineItemRecord>(client, 'quoteLineItems', { quoteId: { in: quoteIds } }, LINE_SELECTION),
  ]);
  const previousByQuoteId = new Map(changes.map((change) => [change.quoteId, change.previousPriceBookId]));
  const currentByQuoteId = new Map(quotes.map((quote) => [quote.id, quote.priceBookId]));
  const prices = await loadProductPrices(
    client,
    unique(lines.map((line) => line.productId)),
    unique([...previousByQuoteId.values(), ...currentByQuoteId.values()]),
  );
  let repriced = 0;

  for (const line of lines) {
    if (!line.productId || !line.quoteId || !currentByQuoteId.has(line.quoteId)) {
      continue;
    }

    const previousPrice = defaultPriceFor(prices, line.productId, previousByQuoteId.get(line.quoteId));
    const listPrice = prices.productById.get(line.productId)?.listPrice;
    const isCustomPrice =
      hasAmount(line.unitPrice) &&
      !isSameCurrencyValue(line.unitPrice, previousPrice) &&
      !isSameCurrencyValue(line.unitPrice, listPrice);

    if (isCustomPrice) {
      continue;
    }

    const patch = computeLineItemPatch(
      line,
      { productChanged: true, unitPriceSetByUser: false },
      { defaultUnitPrice: defaultPriceFor(prices, line.productId, currentByQuoteId.get(line.quoteId)) },
    );

    if (patch?.unitPrice) {
      await client.mutation({
        updateQuoteLineItem: { __args: { id: line.id, data: patch }, id: true },
      });
      repriced++;
    }
  }

  return repriced;
};

export const recomputeAllQuotes = async (client: CrmClient): Promise<number> => {
  const quotes = await fetchAll<{ id: string }>(client, 'quotes', undefined, { id: true });
  let updated = 0;

  for (let start = 0; start < quotes.length; start += 50) {
    updated += await recomputeQuotes(
      client,
      quotes.slice(start, start + 50).map(({ id }) => id),
    );
  }

  return updated;
};
