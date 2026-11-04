import { defineLogicFunction } from 'twenty-sdk/define';
import { type DatabaseEventBatchPayload } from 'twenty-sdk/logic-function';

import { CAMPAIGN_FORECAST_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIERS as IDS } from 'src/constants/campaign-forecast-identifiers';
import { recomputeCampaignRollups } from 'src/utils/recompute-campaign-rollups';
import { appClient } from 'src/utils/app-client';

const handler = async (batch: DatabaseEventBatchPayload<any>) => {
  const campaignIds = batch.events.map((event: { recordId: string }) => event.recordId);

  if (campaignIds.length > 0) {
    await recomputeCampaignRollups({ client: appClient(), campaignIds });
  }
};

export default defineLogicFunction({
  universalIdentifier: IDS.onCampaignCostChanged,
  name: 'on-campaign-cost-changed',
  description:
    "Recalculates a campaign's ROI when it is created or its costs change.",
  timeoutSeconds: 120,
  databaseEventTriggerSettings: {
    eventName: 'campaign.*',
    updatedFields: ['actualCost', 'budgetedCost'],
    batchMode: true,
  },
  handler,
});
