import { CoreApiClient } from 'twenty-client-sdk/core';
import {
  defineLogicFunction,
  type ObjectRecordUpdateEvent,
} from 'twenty-sdk/define';
import { type DatabaseEventBatchPayload } from 'twenty-sdk/logic-function';

import { LeadStatus } from 'src/constants/lead-options';
import { ON_LEAD_STATUS_CONVERTED_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';
import { convertLeads } from 'src/utils/convert-leads';

type LeadStatusUpdate = {
  status?: string | null;
  convertedOpportunityId?: string | null;
};

// Picks leads someone moved to "Converted" by hand (e.g. dragging the kanban
// card). The conversion itself also writes CONVERTED, but by then the lead
// carries its opportunity, so it is skipped and never loops.
export const selectLeadIdsToConvert = (
  events: { recordId: string; properties: { after?: LeadStatusUpdate | null } }[],
): string[] =>
  events
    .filter(
      ({ properties }) =>
        properties.after?.status === LeadStatus.CONVERTED &&
        !properties.after?.convertedOpportunityId,
    )
    .map(({ recordId }) => recordId);

const handler = async (
  batch: DatabaseEventBatchPayload<ObjectRecordUpdateEvent<LeadStatusUpdate>>,
) => {
  const leadIds = selectLeadIdsToConvert(batch.events);

  if (leadIds.length === 0) {
    return;
  }

  await convertLeads({ client: new CoreApiClient(), leadIds });
};

export default defineLogicFunction({
  universalIdentifier:
    ON_LEAD_STATUS_CONVERTED_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIER,
  name: 'on-lead-status-converted',
  description:
    'Runs the lead conversion when a lead is moved to the Converted status.',
  timeoutSeconds: 300,
  databaseEventTriggerSettings: {
    eventName: 'lead.updated',
    updatedFields: ['status'],
    batchMode: true,
  },
  handler,
});
