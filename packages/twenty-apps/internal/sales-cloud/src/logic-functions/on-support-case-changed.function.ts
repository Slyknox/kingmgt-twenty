import { defineLogicFunction } from 'twenty-sdk/define';
import { type DatabaseEventBatchPayload } from 'twenty-sdk/logic-function';

import { SUPPORT_CASE_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIERS as IDS } from 'src/constants/support-case-identifiers';
import { appClient } from 'src/utils/app-client';
import { applySupportCaseRules } from 'src/utils/compute-support-case';
import { eventAction, isRemovalAction } from 'src/utils/group-by';

const handler = async (batch: DatabaseEventBatchPayload<any>) => {
  if (isRemovalAction(eventAction(batch.name))) {
    return;
  }

  await applySupportCaseRules(
    appClient(),
    batch.events.map((event: { recordId: string }) => event.recordId),
  );
};

export default defineLogicFunction({
  universalIdentifier: IDS.onSupportCaseChanged,
  name: 'on-support-case-changed',
  description:
    "Sets a case's deadline from its priority and records when it was first answered and closed.",
  timeoutSeconds: 60,
  databaseEventTriggerSettings: {
    eventName: 'supportCase.*',
    updatedFields: ['status', 'priority'],
    batchMode: true,
  },
  handler,
});
