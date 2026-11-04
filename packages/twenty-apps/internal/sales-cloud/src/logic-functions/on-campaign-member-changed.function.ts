import { defineLogicFunction } from 'twenty-sdk/define';
import { type DatabaseEventBatchPayload } from 'twenty-sdk/logic-function';

import { ON_CAMPAIGN_MEMBER_CHANGED_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIER } from 'src/constants/campaign-forecast-identifiers';
import { appClient } from 'src/utils/app-client';
import { eventAction, isRemovalAction } from 'src/utils/group-by';
import {
  collectCampaignIds,
  recomputeCampaignRollups,
} from 'src/utils/recompute-campaign-rollups';
import { syncCampaignMembers } from 'src/utils/sync-campaign-members';

const handler = async (batch: DatabaseEventBatchPayload<any>) => {
  const client = appClient();

  if (!isRemovalAction(eventAction(batch.name))) {
    await syncCampaignMembers(
      client,
      batch.events.map((event: { recordId: string }) => event.recordId),
    );
  }

  await recomputeCampaignRollups({ client, campaignIds: collectCampaignIds(batch.events) });
};

export default defineLogicFunction({
  universalIdentifier: ON_CAMPAIGN_MEMBER_CHANGED_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIER,
  name: 'on-campaign-member-changed',
  description:
    "Names a campaign member, records when it responded, and recalculates its campaigns' member counts.",
  timeoutSeconds: 120,
  databaseEventTriggerSettings: {
    eventName: 'campaignMember.*',
    updatedFields: ['campaignId', 'leadId', 'personId', 'memberStatus'],
    batchMode: true,
  },
  handler,
});
