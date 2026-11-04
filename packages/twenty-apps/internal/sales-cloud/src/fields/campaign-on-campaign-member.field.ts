import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';

import {
  CAMPAIGN_MEMBER_RELATION_UNIVERSAL_IDENTIFIERS,
  CAMPAIGN_MEMBER_UNIVERSAL_IDENTIFIER,
  CAMPAIGN_UNIVERSAL_IDENTIFIER,
} from 'src/constants/campaign-forecast-identifiers';

export default defineField({
  universalIdentifier: CAMPAIGN_MEMBER_RELATION_UNIVERSAL_IDENTIFIERS.campaignOnMember,
  objectUniversalIdentifier: CAMPAIGN_MEMBER_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'campaign',
  label: 'Campaign',
  icon: 'IconSpeakerphone',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier: CAMPAIGN_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    CAMPAIGN_MEMBER_RELATION_UNIVERSAL_IDENTIFIERS.membersOnCampaign,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.CASCADE,
    joinColumnName: 'campaignId',
  },
});
