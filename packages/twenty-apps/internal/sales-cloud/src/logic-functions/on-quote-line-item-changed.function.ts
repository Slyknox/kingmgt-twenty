import { defineLogicFunction } from 'twenty-sdk/define';
import { type DatabaseEventBatchPayload } from 'twenty-sdk/logic-function';

import { QUOTE_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIERS as IDS } from 'src/constants/quote-identifiers';
import { collectFieldValues, collectRecordChanges } from 'src/utils/collect-record-changes';
import { hasAmount } from 'src/utils/currency';
import { type LineItemChange } from 'src/utils/compute-quote-pricing';
import { priceLineItems, recomputeQuotes } from 'src/utils/sync-quotes';
import { appClient } from 'src/utils/app-client';

export const collectLineItemChanges = (
  batchName: string,
  events: Parameters<typeof collectRecordChanges>[1],
): Map<string, LineItemChange> =>
  new Map(
    [
      ...collectRecordChanges(batchName, events, {
        trigger: 'productId',
        override: 'unitPrice',
        hasValue: (value) => hasAmount(value as any),
      }),
    ].map(([id, change]) => [
      id,
      { productChanged: change.triggerChanged, unitPriceSetByUser: change.overrideSet },
    ]),
  );

const handler = async (batch: DatabaseEventBatchPayload<any>) => {
  const client = appClient();
  const pricedQuoteIds = await priceLineItems(
    client,
    collectLineItemChanges(batch.name, batch.events),
  );

  await recomputeQuotes(client, [
    ...pricedQuoteIds,
    ...collectFieldValues(batch.events, 'quoteId'),
  ]);
};

export default defineLogicFunction({
  universalIdentifier: IDS.onQuoteLineItemChanged,
  name: 'on-quote-line-item-changed',
  description:
    "Prices a quote line from the quote's price book, works out its totals, and recalculates the quote.",
  timeoutSeconds: 120,
  databaseEventTriggerSettings: {
    eventName: 'quoteLineItem.*',
    updatedFields: ['productId', 'quantity', 'unitPrice', 'discountPercent', 'quoteId', 'name'],
    batchMode: true,
  },
  handler,
});
