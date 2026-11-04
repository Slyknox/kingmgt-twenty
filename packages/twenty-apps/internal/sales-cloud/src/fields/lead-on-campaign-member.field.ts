import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';

import {
  CAMPAIGN_MEMBER_RELATION_UNIVERSAL_IDENTIFIERS,
  CAMPAIGN_MEMBER_UNIVERSAL_IDENTIFIER,
} from 'src/constants/campaign-forecast-identifiers';
import { LEAD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: CAMPAIGN_MEMBER_RELATION_UNIVERSAL_IDENTIFIERS.leadOnMember,
  objectUniversalIdentifier: CAMPAIGN_MEMBER_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'lead',
  label: 'Lead',
  icon: 'IconTargetArrow',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    CAMPAIGN_MEMBER_RELATION_UNIVERSAL_IDENTIFIERS.campaignMembershipsOnLead,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'leadId',
  },
});
