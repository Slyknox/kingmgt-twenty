import { defineView, ViewType } from 'twenty-sdk/define';

import {
  ALL_CAMPAIGNS_VIEW_FIELD_UNIVERSAL_IDENTIFIERS as VIEW_FIELD_IDS,
  ALL_CAMPAIGNS_VIEW_UNIVERSAL_IDENTIFIER,
  CAMPAIGN_FIELD_UNIVERSAL_IDENTIFIERS as F,
  CAMPAIGN_UNIVERSAL_IDENTIFIER,
} from 'src/constants/campaign-forecast-identifiers';

const COLUMNS = [
  { field: F.name, size: 220 },
  { field: F.campaignType, size: 140 },
  { field: F.status, size: 130 },
  { field: F.startDate, size: 120 },
  { field: F.endDate, size: 120 },
  { field: F.actualCost, size: 140 },
  { field: F.leadCount, size: 100 },
  { field: F.opportunityCount, size: 120 },
  { field: F.wonAmount, size: 140 },
  { field: F.roiPercent, size: 100 },
];

export default defineView({
  universalIdentifier: ALL_CAMPAIGNS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'All Campaigns',
  objectUniversalIdentifier: CAMPAIGN_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconList',
  position: 0,
  fields: COLUMNS.map(({ field, size }, index) => ({
    universalIdentifier: VIEW_FIELD_IDS[index],
    fieldMetadataUniversalIdentifier: field,
    position: index,
    isVisible: true,
    size,
  })),
});
