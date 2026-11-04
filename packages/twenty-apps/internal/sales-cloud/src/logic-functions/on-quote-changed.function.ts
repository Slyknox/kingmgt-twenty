import { defineLogicFunction } from 'twenty-sdk/define';
import { type DatabaseEventBatchPayload } from 'twenty-sdk/logic-function';

import { QUOTE_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIERS as IDS } from 'src/constants/quote-identifiers';
import { eventAction, isRemovalAction } from 'src/utils/group-by';
import { keepOneSyncingQuotePerOpportunity, recomputeQuotes } from 'src/utils/sync-quotes';
import { appClient } from 'src/utils/app-client';

type QuoteEvent = {
  recordId: string;
  properties: { updatedFields?: string[]; after?: { syncToOpportunity?: boolean | null } | null };
};

export const selectNewlySyncingQuoteIds = (batchName: string, events: QuoteEvent[]) => {
  const action = eventAction(batchName);

  return events
    .filter(
      ({ properties }) =>
        properties.after?.syncToOpportunity === true &&
        (action === 'created' ||
          action === 'restored' ||
          (properties.updatedFields ?? []).some((field) =>
            ['syncToOpportunity', 'opportunityId'].includes(field),
          )),
    )
    .map(({ recordId }) => recordId);
};

const handler = async (batch: DatabaseEventBatchPayload<any>) => {
  if (isRemovalAction(eventAction(batch.name))) {
    return;
  }

  const client = appClient();

  await keepOneSyncingQuotePerOpportunity(
    client,
    selectNewlySyncingQuoteIds(batch.name, batch.events),
  );
  await recomputeQuotes(
    client,
    batch.events.map((event: { recordId: string }) => event.recordId),
  );
};

export default defineLogicFunction({
  universalIdentifier: IDS.onQuoteChanged,
  name: 'on-quote-changed',
  description:
    "Keeps one syncing quote per opportunity and copies a syncing quote's total onto its opportunity.",
  timeoutSeconds: 120,
  databaseEventTriggerSettings: {
    eventName: 'quote.*',
    updatedFields: ['syncToOpportunity', 'opportunityId'],
    batchMode: true,
  },
  handler,
});
