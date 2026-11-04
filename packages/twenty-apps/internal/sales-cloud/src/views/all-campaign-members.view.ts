import { defineView, ViewType } from 'twenty-sdk/define';

import {
  ALL_CAMPAIGN_MEMBERS_VIEW_FIELD_UNIVERSAL_IDENTIFIERS as VIEW_FIELD_IDS,
  ALL_CAMPAIGN_MEMBERS_VIEW_UNIVERSAL_IDENTIFIER,
  CAMPAIGN_MEMBER_FIELD_UNIVERSAL_IDENTIFIERS as F,
  CAMPAIGN_MEMBER_RELATION_UNIVERSAL_IDENTIFIERS as R,
  CAMPAIGN_MEMBER_UNIVERSAL_IDENTIFIER,
} from 'src/constants/campaign-forecast-identifiers';

const COLUMNS = [
  { field: F.name, size: 240 },
  { field: R.campaignOnMember, size: 200 },
  { field: R.leadOnMember, size: 180 },
  { field: R.personOnMember, size: 180 },
  { field: F.memberStatus, size: 120 },
  { field: F.respondedAt, size: 150 },
];

export default defineView({
  universalIdentifier: ALL_CAMPAIGN_MEMBERS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'All Campaign Members',
  objectUniversalIdentifier: CAMPAIGN_MEMBER_UNIVERSAL_IDENTIFIER,
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
