import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';

import {
  CAMPAIGN_RELATION_UNIVERSAL_IDENTIFIERS,
  CAMPAIGN_UNIVERSAL_IDENTIFIER,
} from 'src/constants/campaign-forecast-identifiers';
import { LEAD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

// Salesforce's "Primary Campaign Source".
export default defineField({
  universalIdentifier: CAMPAIGN_RELATION_UNIVERSAL_IDENTIFIERS.campaignOnLead,
  objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'campaign',
  label: 'Campaign source',
  icon: 'IconSpeakerphone',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier: CAMPAIGN_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    CAMPAIGN_RELATION_UNIVERSAL_IDENTIFIERS.leadsOnCampaign,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'campaignId',
  },
});
