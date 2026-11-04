import { CoreApiClient } from 'twenty-client-sdk/core';
import { defineLogicFunction } from 'twenty-sdk/define';
import { type DatabaseEventBatchPayload } from 'twenty-sdk/logic-function';

import { CAMPAIGN_FORECAST_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIERS as IDS } from 'src/constants/campaign-forecast-identifiers';
import {
  collectCampaignIds,
  recomputeCampaignRollups,
} from 'src/utils/recompute-campaign-rollups';

const handler = async (batch: DatabaseEventBatchPayload<any>) => {
  const campaignIds = collectCampaignIds(batch.events);

  if (campaignIds.length > 0) {
    await recomputeCampaignRollups({ client: new CoreApiClient(), campaignIds });
  }
};

export default defineLogicFunction({
  universalIdentifier: IDS.onLeadCampaignInputsChanged,
  name: 'on-lead-campaign-inputs-changed',
  description:
    "Recalculates the campaigns a lead belongs to, or left, when it is created, deleted or its campaign or status changes.",
  timeoutSeconds: 120,
  databaseEventTriggerSettings: {
    eventName: 'lead.*',
    updatedFields: ['campaignId', 'status'],
    batchMode: true,
  },
  handler,
});
