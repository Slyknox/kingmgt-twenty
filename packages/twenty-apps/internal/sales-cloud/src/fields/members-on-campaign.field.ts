import {
  defineField,
  FieldType,
  RelationType,
} from 'twenty-sdk/define';

import {
  CAMPAIGN_MEMBER_RELATION_UNIVERSAL_IDENTIFIERS,
  CAMPAIGN_MEMBER_UNIVERSAL_IDENTIFIER,
  CAMPAIGN_UNIVERSAL_IDENTIFIER,
} from 'src/constants/campaign-forecast-identifiers';

export default defineField({
  universalIdentifier: CAMPAIGN_MEMBER_RELATION_UNIVERSAL_IDENTIFIERS.membersOnCampaign,
  objectUniversalIdentifier: CAMPAIGN_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'members',
  label: 'Members',
  icon: 'IconUsersGroup',
  relationTargetObjectMetadataUniversalIdentifier: CAMPAIGN_MEMBER_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    CAMPAIGN_MEMBER_RELATION_UNIVERSAL_IDENTIFIERS.campaignOnMember,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
