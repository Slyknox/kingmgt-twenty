import { defineLogicFunction } from 'twenty-sdk/define';
import { type DatabaseEventBatchPayload } from 'twenty-sdk/logic-function';

import { QUOTE_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIERS as IDS } from 'src/constants/quote-identifiers';
import { fetchAll } from 'src/utils/fetch-all';
import { eventAction, isRemovalAction } from 'src/utils/group-by';
import { type CrmClient } from 'src/utils/lead-conversion-types';
import { appClient } from 'src/utils/app-client';

type EntryRecord = {
  id: string;
  name?: string | null;
  product?: { name?: string | null } | null;
  priceBook?: { name?: string | null } | null;
};

export const buildEntryName = (entry: EntryRecord): string | null => {
  const parts = [entry.product?.name, entry.priceBook?.name]
    .map((part) => part?.trim())
    .filter(Boolean);

  return parts.length > 0 ? parts.join(' - ') : null;
};

// Fills in an empty entry name; one a person typed is never replaced.
export const nameEntries = async (client: CrmClient, entryIds: string[]) => {
  if (entryIds.length === 0) {
    return;
  }

  const entries = await fetchAll<EntryRecord>(
    client,
    'priceBookEntries',
    { id: { in: entryIds } },
    { id: true, name: true, product: { name: true }, priceBook: { name: true } },
  );

  for (const entry of entries) {
    const name = buildEntryName(entry);

    if (!entry.name?.trim() && name) {
      await client.mutation({
        updatePriceBookEntry: { __args: { id: entry.id, data: { name } }, id: true },
      });
    }
  }
};

const handler = async (batch: DatabaseEventBatchPayload<any>) => {
  if (isRemovalAction(eventAction(batch.name))) {
    return;
  }

  await nameEntries(
    appClient(),
    batch.events.map((event: { recordId: string }) => event.recordId),
  );
};

export default defineLogicFunction({
  universalIdentifier: IDS.onPriceBookEntryChanged,
  name: 'on-price-book-entry-changed',
  description: 'Names a price book entry after its product and price book.',
  timeoutSeconds: 60,
  databaseEventTriggerSettings: {
    eventName: 'priceBookEntry.*',
    updatedFields: ['productId', 'priceBookId', 'name'],
    batchMode: true,
  },
  handler,
});
