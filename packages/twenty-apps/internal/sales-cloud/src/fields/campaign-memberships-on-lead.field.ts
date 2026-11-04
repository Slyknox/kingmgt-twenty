import {
  defineField,
  FieldType,
  RelationType,
} from 'twenty-sdk/define';

import {
  CAMPAIGN_MEMBER_RELATION_UNIVERSAL_IDENTIFIERS,
  CAMPAIGN_MEMBER_UNIVERSAL_IDENTIFIER,
} from 'src/constants/campaign-forecast-identifiers';
import { LEAD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: CAMPAIGN_MEMBER_RELATION_UNIVERSAL_IDENTIFIERS.campaignMembershipsOnLead,
  objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'campaignMemberships',
  label: 'Campaign memberships',
  icon: 'IconUsersGroup',
  relationTargetObjectMetadataUniversalIdentifier: CAMPAIGN_MEMBER_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    CAMPAIGN_MEMBER_RELATION_UNIVERSAL_IDENTIFIERS.leadOnMember,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
