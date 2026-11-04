import { defineObject, FieldType } from 'twenty-sdk/define';

import {
  CAMPAIGN_MEMBER_FIELD_UNIVERSAL_IDENTIFIERS as F,
  CAMPAIGN_MEMBER_UNIVERSAL_IDENTIFIER,
} from 'src/constants/campaign-forecast-identifiers';
import {
  CAMPAIGN_MEMBER_STATUS_OPTIONS,
  CampaignMemberStatus,
} from 'src/constants/campaign-options';

export default defineObject({
  universalIdentifier: CAMPAIGN_MEMBER_UNIVERSAL_IDENTIFIER,
  nameSingular: 'campaignMember',
  namePlural: 'campaignMembers',
  labelSingular: 'Campaign member',
  labelPlural: 'Campaign members',
  description:
    'A lead or person reached by a campaign. One lead or person can belong to many campaigns.',
  icon: 'IconUsersGroup',
  labelIdentifierFieldMetadataUniversalIdentifier: F.name,
  fields: [
    { universalIdentifier: F.name, type: FieldType.TEXT, name: 'name', label: 'Name', description: 'Filled in as "<campaign> - <member>"', icon: 'IconAbc', isNullable: true },
    {
      universalIdentifier: F.memberStatus,
      type: FieldType.SELECT,
      name: 'memberStatus',
      label: 'Status',
      icon: 'IconProgress',
      defaultValue: `'${CampaignMemberStatus.SENT}'`,
      options: CAMPAIGN_MEMBER_STATUS_OPTIONS,
    },
    { universalIdentifier: F.respondedAt, type: FieldType.DATE_TIME, name: 'respondedAt', label: 'Responded at', description: 'Set when the member is first marked Responded', icon: 'IconMessageReply', isNullable: true },
  ],
});
