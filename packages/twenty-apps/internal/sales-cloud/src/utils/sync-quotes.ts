import {
  computeLineItemPatch,
  computeQuoteTotals,
  type LineItemChange,
  type QuoteLineItemRecord,
} from 'src/utils/compute-quote-pricing';
import { hasAmount, isSameCurrencyValue } from 'src/utils/currency';
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

  const [quotes, lines] = await Promise.all([
    fetchQuotes(client, ids),
    fetchAll<QuoteLineItemRecord>(client, 'quoteLineItems', { quoteId: { in: ids } }, LINE_SELECTION),
  ]);
  const linesByQuoteId = groupBy(lines, (line) => line.quoteId);
  const syncedAmountByOpportunityId = new Map<string, Currency>();
  let updated = 0;

  for (const quote of quotes) {
    const totals = computeQuoteTotals(linesByQuoteId.get(quote.id) ?? []);

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
  const quoteIds = [...new Set(lines.map((line) => line.quoteId).filter(Boolean))] as string[];
  const productIds = [...new Set(lines.map((line) => line.productId).filter(Boolean))] as string[];

  const [quotes, products] = await Promise.all([
    quoteIds.length > 0 ? fetchQuotes(client, quoteIds) : Promise.resolve([]),
    productIds.length > 0
      ? fetchAll<ProductRecord>(client, 'products', { id: { in: productIds } }, {
          id: true,
          name: true,
          listPrice: CURRENCY,
        })
      : Promise.resolve([] as ProductRecord[]),
  ]);
  const priceBookIdByQuoteId = new Map(quotes.map((quote) => [quote.id, quote.priceBookId]));
  const priceBookIds = [...new Set(quotes.map((quote) => quote.priceBookId).filter(Boolean))] as string[];
  const entries =
    priceBookIds.length > 0 && productIds.length > 0
      ? await fetchAll<EntryRecord>(
          client,
          'priceBookEntries',
          {
            priceBookId: { in: priceBookIds },
            productId: { in: productIds },
            isActive: { eq: true },
          },
          { priceBookId: true, productId: true, unitPrice: CURRENCY },
        )
      : [];
  const productById = new Map(products.map((product) => [product.id, product]));
  const entryPrice = new Map(
    entries.map((entry) => [`${entry.priceBookId}:${entry.productId}`, entry.unitPrice]),
  );

  for (const line of lines) {
    const product = line.productId ? productById.get(line.productId) : undefined;
    const priceBookId = line.quoteId ? priceBookIdByQuoteId.get(line.quoteId) : undefined;
    const bookPrice = priceBookId && line.productId
      ? entryPrice.get(`${priceBookId}:${line.productId}`)
      : undefined;
    const patch = computeLineItemPatch(line, changes.get(line.id)!, {
      productName: product?.name,
      defaultUnitPrice: hasAmount(bookPrice) ? bookPrice : product?.listPrice,
    });

    if (patch) {
      await client.mutation({
        updateQuoteLineItem: { __args: { id: line.id, data: patch }, id: true },
      });
    }
  }

  return quoteIds;
};
