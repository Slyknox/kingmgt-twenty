import { describe, expect, it } from 'vitest';

import { createFakeCrmClient } from 'src/__tests__/fake-crm-client';
import { buildEntryName, nameEntries } from 'src/logic-functions/on-price-book-entry-changed.function';
import { selectNewlySyncingQuoteIds } from 'src/logic-functions/on-quote-changed.function';
import { collectLineItemChanges } from 'src/logic-functions/on-quote-line-item-changed.function';
import { selectPriceBookChanges } from 'src/logic-functions/on-quote-changed.function';
import { computeLineItemPatch, computeQuoteTotals } from 'src/utils/compute-quote-pricing';
import { buildExchangeRates } from 'src/utils/exchange-rates';
import {
  keepOneSyncingQuotePerOpportunity,
  priceLineItems,
  recomputeQuotes,
  repriceQuoteLines,
} from 'src/utils/sync-quotes';

const usd = (dollars: number) => ({ amountMicros: dollars * 1_000_000, currencyCode: 'USD' });
const eur = (euros: number) => ({ amountMicros: euros * 1_000_000, currencyCode: 'EUR' });
const PICKED = { productChanged: true, unitPriceSetByUser: false };
const NOTHING = { productChanged: false, unitPriceSetByUser: false };

describe('computeLineItemPatch', () => {
  it('names and prices a new line from its product and works out its totals', () => {
    expect(
      computeLineItemPatch({ id: 'l', quantity: 3, discountPercent: 10 }, PICKED, {
        productName: 'Widget',
        defaultUnitPrice: usd(100),
      }),
    ).toEqual({ name: 'Widget', unitPrice: usd(100), subtotal: usd(300), total: usd(270) });
  });

  it('keeps a price typed in the same edit that picked the product', () => {
    expect(
      computeLineItemPatch({ id: 'l', name: 'Widget', unitPrice: usd(80) }, { productChanged: true, unitPriceSetByUser: true }, {
        defaultUnitPrice: usd(100),
      }),
    ).toEqual({ subtotal: usd(80), total: usd(80) });
  });

  it("clears the old product's price when the new product has none", () => {
    expect(
      computeLineItemPatch({ id: 'l', name: 'Old', unitPrice: usd(70), subtotal: usd(70), total: usd(70) }, PICKED, { productName: 'Unpriced' }),
    ).toEqual({
      unitPrice: { amountMicros: null, currencyCode: 'USD' },
      subtotal: { amountMicros: null, currencyCode: 'USD' },
      total: { amountMicros: null, currencyCode: 'USD' },
    });
  });

  it('counts an empty quantity as 1 and clamps a discount over 100%', () => {
    expect(
      computeLineItemPatch({ id: 'l', name: 'x', unitPrice: usd(50), discountPercent: 140 }, NOTHING, {}),
    ).toEqual({ discountPercent: 100, subtotal: usd(50), total: usd(0) });
  });

  it('has nothing to write on its own output, so the trigger cannot loop', () => {
    const line = { id: 'l', quantity: 2 };
    const patch = computeLineItemPatch(line, PICKED, { productName: 'W', defaultUnitPrice: usd(10) })!;

    expect(computeLineItemPatch({ ...line, ...patch }, { productChanged: false, unitPriceSetByUser: true }, {
      productName: 'W', defaultUnitPrice: usd(10),
    })).toBeNull();
  });
});

describe('computeQuoteTotals', () => {
  it('sums lines in the main currency and explains what it left out', () => {
    expect(
      computeQuoteTotals([
        { id: 'a', quantity: 2, unitPrice: usd(100), discountPercent: 25 },
        { id: 'b', unitPrice: usd(50) },
        { id: 'c', unitPrice: eur(999) },
        { id: 'd' },
      ]),
    ).toEqual({
      subtotal: usd(250),
      discountTotal: usd(50),
      total: usd(200),
      lineItemCount: 4,
      pricingWarning: '1 line item has no price and is left out. 1 line item is not in USD, has no exchange rate and is left out.',
    });
  });

  it('converts lines in another currency through the exchange rates', () => {
    const rates = buildExchangeRates([
      { currencyCode: 'USD', isCorporate: true },
      { currencyCode: 'EUR', unitsPerCorporateUnit: 0.8 },
    ]);

    expect(
      computeQuoteTotals([
        { id: 'a', unitPrice: usd(100) },
        { id: 'b', unitPrice: usd(100) },
        { id: 'c', unitPrice: eur(80) },
        { id: 'd', unitPrice: { amountMicros: 1_000_000, currencyCode: 'JPY' } },
      ], rates),
    ).toMatchObject({
      total: usd(300),
      pricingWarning:
        '1 line item is not in USD, has no exchange rate and is left out. 1 line item was converted to USD from EUR at the stored exchange rates.',
    });
  });

  it('gives an empty quote zero totals and no warning', () => {
    expect(computeQuoteTotals([])).toMatchObject({ total: usd(0), lineItemCount: 0, pricingWarning: null });
  });
});

describe('pricing lines against the database', () => {
  const seed = () => ({
    product: [{ id: 'widget', name: 'Widget', listPrice: usd(100) }, { id: 'gadget', name: 'Gadget', listPrice: usd(40) }],
    priceBook: [{ id: 'partner', name: 'Partner', isActive: true }],
    priceBookEntry: [
      { id: 'e1', priceBookId: 'partner', productId: 'widget', unitPrice: usd(70), isActive: true },
      { id: 'e2', priceBookId: 'partner', productId: 'gadget', unitPrice: usd(1), isActive: false },
    ],
    opportunity: [{ id: 'deal', amount: usd(5) }],
    quote: [{ id: 'q', priceBookId: 'partner', opportunityId: 'deal', syncToOpportunity: true }],
    quoteLineItem: [
      { id: 'l1', quoteId: 'q', productId: 'widget', quantity: 2 },
      { id: 'l2', quoteId: 'q', productId: 'gadget' },
    ],
  });

  it("uses the quote's active price book entry, else the list price, then syncs the opportunity", async () => {
    const { client, tables } = createFakeCrmClient(seed());

    const quoteIds = await priceLineItems(client, new Map([['l1', PICKED], ['l2', PICKED]]));
    await recomputeQuotes(client, quoteIds);

    expect(tables.quoteLineItem[0]).toMatchObject({ name: 'Widget', unitPrice: usd(70), total: usd(140) });
    expect(tables.quoteLineItem[1]).toMatchObject({ name: 'Gadget', unitPrice: usd(40), total: usd(40) });
    expect(tables.quote[0]).toMatchObject({ total: usd(180), lineItemCount: 2, pricingWarning: null });
    expect(tables.opportunity[0].amount).toEqual(usd(180));
  });

  it('writes nothing the second time', async () => {
    const { client, updates } = createFakeCrmClient(seed());

    await recomputeQuotes(client, await priceLineItems(client, new Map([['l1', PICKED], ['l2', PICKED]])));
    const firstPass = updates.length;
    await recomputeQuotes(client, await priceLineItems(client, new Map([['l1', NOTHING], ['l2', NOTHING]])));

    expect(updates.length).toBe(firstPass);
  });

  it('leaves the opportunity alone while a syncing quote has no priced lines', async () => {
    const { client, tables } = createFakeCrmClient({
      opportunity: [{ id: 'deal', amount: eur(50_000) }],
      quote: [{ id: 'q', opportunityId: 'deal', syncToOpportunity: true }],
    });

    await recomputeQuotes(client, ['q']);

    expect(tables.opportunity[0].amount).toEqual(eur(50_000));
    expect(tables.quote[0].total).toEqual(usd(0));
  });

  it('skips inactive products and entries in inactive price books', async () => {
    const { client, tables } = createFakeCrmClient({
      product: [
        { id: 'retired', name: 'Retired', listPrice: usd(10), isActive: false },
        { id: 'widget', name: 'Widget', listPrice: usd(100), isActive: true },
      ],
      priceBook: [{ id: 'old', isActive: false }],
      priceBookEntry: [{ id: 'e', priceBookId: 'old', productId: 'widget', unitPrice: usd(1), isActive: true }],
      quote: [{ id: 'q', priceBookId: 'old' }],
      quoteLineItem: [
        { id: 'l1', quoteId: 'q', productId: 'retired' },
        { id: 'l2', quoteId: 'q', productId: 'widget' },
      ],
    });

    await priceLineItems(client, new Map([['l1', PICKED], ['l2', PICKED]]));

    expect(tables.quoteLineItem.map((line) => line.unitPrice ?? null)).toEqual([null, usd(100)]);
  });

  it("does not touch the opportunity of a quote that isn't syncing", async () => {
    const data = seed();
    data.quote[0].syncToOpportunity = false;
    const { client, tables } = createFakeCrmClient(data);

    await recomputeQuotes(client, ['q']);

    expect(tables.opportunity[0].amount).toEqual(usd(5));
  });

  it('switches off syncing on the other quotes of the same opportunity', async () => {
    const { client, tables } = createFakeCrmClient({
      quote: [
        { id: 'old', opportunityId: 'deal', syncToOpportunity: true },
        { id: 'new', opportunityId: 'deal', syncToOpportunity: true },
        { id: 'elsewhere', opportunityId: 'other', syncToOpportunity: true },
      ],
    });

    await keepOneSyncingQuotePerOpportunity(client, ['new']);

    expect(tables.quote.map((quote) => quote.syncToOpportunity)).toEqual([false, true, true]);
  });
});

describe('changing the price book', () => {
  const seed = () => ({
    product: [{ id: 'widget', name: 'Widget', listPrice: usd(100) }, { id: 'gadget', name: 'Gadget', listPrice: usd(40) }],
    priceBook: [{ id: 'retail', isActive: true }, { id: 'partner', isActive: true }],
    priceBookEntry: [
      { id: 'e1', priceBookId: 'retail', productId: 'widget', unitPrice: usd(90), isActive: true },
      { id: 'e2', priceBookId: 'partner', productId: 'widget', unitPrice: usd(70), isActive: true },
      { id: 'e3', priceBookId: 'partner', productId: 'gadget', unitPrice: usd(30), isActive: true },
    ],
    quote: [{ id: 'q', priceBookId: 'partner' }],
    quoteLineItem: [
      { id: 'from-book', quoteId: 'q', productId: 'widget', unitPrice: usd(90) },
      { id: 'from-list', quoteId: 'q', productId: 'gadget', unitPrice: usd(40) },
      { id: 'typed', quoteId: 'q', productId: 'widget', unitPrice: usd(55) },
    ],
  });

  it("re-prices lines from the new book and keeps prices someone typed", async () => {
    const { client, tables } = createFakeCrmClient(seed());

    expect(await repriceQuoteLines(client, [{ quoteId: 'q', previousPriceBookId: 'retail' }])).toBe(2);
    expect(tables.quoteLineItem.map((line) => line.unitPrice)).toEqual([usd(70), usd(30), usd(55)]);
  });

  it('only re-prices on a price book change to an existing quote', () => {
    expect(
      selectPriceBookChanges('quote.updated', [
        { recordId: 'q1', properties: { updatedFields: ['priceBookId'], before: { priceBookId: 'old' } } },
        { recordId: 'q2', properties: { updatedFields: ['name'] } },
      ]),
    ).toEqual([{ quoteId: 'q1', previousPriceBookId: 'old' }]);
    expect(selectPriceBookChanges('quote.created', [{ recordId: 'q', properties: {} }])).toEqual([]);
  });
});

describe('event handling', () => {
  it('treats a product picked at creation, with or without a typed price', () => {
    const changes = collectLineItemChanges('quoteLineItem.created', [
      { recordId: 'a', properties: { after: { productId: 'p' } } },
      { recordId: 'b', properties: { after: { productId: 'p', unitPrice: usd(5) } } },
    ]);

    expect(changes.get('a')).toEqual({ productChanged: true, unitPriceSetByUser: false });
    expect(changes.get('b')).toEqual({ productChanged: true, unitPriceSetByUser: true });
    expect(collectLineItemChanges('quoteLineItem.deleted', [{ recordId: 'a', properties: {} }]).size).toBe(0);
  });

  it('picks quotes whose syncing was just switched on', () => {
    expect(
      selectNewlySyncingQuoteIds('quote.updated', [
        { recordId: 'on', properties: { updatedFields: ['syncToOpportunity'], after: { syncToOpportunity: true } } },
        { recordId: 'off', properties: { updatedFields: ['syncToOpportunity'], after: { syncToOpportunity: false } } },
        { recordId: 'untouched', properties: { updatedFields: ['name'], after: { syncToOpportunity: true } } },
      ]),
    ).toEqual(['on']);
  });

  it('names price book entries without replacing a typed name', async () => {
    expect(buildEntryName({ id: 'e', product: { name: 'Widget' }, priceBook: { name: 'Partner' } })).toBe('Widget - Partner');
    const { client, tables } = createFakeCrmClient({
      product: [{ id: 'w', name: 'Widget' }],
      priceBook: [{ id: 'p', name: 'Partner' }],
      priceBookEntry: [
        { id: 'e1', productId: 'w', priceBookId: 'p' },
        { id: 'e2', productId: 'w', priceBookId: 'p', name: 'Custom' },
      ],
    });

    await nameEntries(client, ['e1', 'e2']);

    expect(tables.priceBookEntry.map((entry) => entry.name)).toEqual(['Widget - Partner', 'Custom']);
  });
});
