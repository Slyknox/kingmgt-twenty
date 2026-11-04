import { describe, expect, it } from 'vitest';

import { createFakeCrmClient } from 'src/__tests__/fake-crm-client';
import { buildEntryName, nameEntries } from 'src/logic-functions/on-price-book-entry-changed.function';
import { selectNewlySyncingQuoteIds } from 'src/logic-functions/on-quote-changed.function';
import { collectLineItemChanges } from 'src/logic-functions/on-quote-line-item-changed.function';
import { computeLineItemPatch, computeQuoteTotals } from 'src/utils/compute-quote-pricing';
import {
  keepOneSyncingQuotePerOpportunity,
  priceLineItems,
  recomputeQuotes,
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
      pricingWarning: '1 line item has no price and is left out. 1 line item is not in USD and left out.',
    });
  });

  it('gives an empty quote zero totals and no warning', () => {
    expect(computeQuoteTotals([])).toMatchObject({ total: usd(0), lineItemCount: 0, pricingWarning: null });
  });
});

describe('pricing lines against the database', () => {
  const seed = () => ({
    product: [{ id: 'widget', name: 'Widget', listPrice: usd(100) }, { id: 'gadget', name: 'Gadget', listPrice: usd(40) }],
    priceBook: [{ id: 'partner', name: 'Partner' }],
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
