import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  CAMPAIGN_MEMBER_RELATION_UNIVERSAL_IDENTIFIERS,
  CAMPAIGN_MEMBER_UNIVERSAL_IDENTIFIER,
} from 'src/constants/campaign-forecast-identifiers';

export default defineField({
  universalIdentifier: CAMPAIGN_MEMBER_RELATION_UNIVERSAL_IDENTIFIERS.personOnMember,
  objectUniversalIdentifier: CAMPAIGN_MEMBER_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'person',
  label: 'Person',
  icon: 'IconUser',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    CAMPAIGN_MEMBER_RELATION_UNIVERSAL_IDENTIFIERS.campaignMembershipsOnPerson,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'personId',
  },
});
