import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  CAMPAIGN_MEMBER_RELATION_UNIVERSAL_IDENTIFIERS,
  CAMPAIGN_MEMBER_UNIVERSAL_IDENTIFIER,
} from 'src/constants/campaign-forecast-identifiers';

export default defineField({
  universalIdentifier: CAMPAIGN_MEMBER_RELATION_UNIVERSAL_IDENTIFIERS.campaignMembershipsOnPerson,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.RELATION,
  name: 'campaignMemberships',
  label: 'Campaign memberships',
  icon: 'IconUsersGroup',
  relationTargetObjectMetadataUniversalIdentifier: CAMPAIGN_MEMBER_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    CAMPAIGN_MEMBER_RELATION_UNIVERSAL_IDENTIFIERS.personOnMember,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
