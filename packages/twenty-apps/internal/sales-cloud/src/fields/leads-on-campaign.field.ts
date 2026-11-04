import {
  defineField,
  FieldType,
  RelationType,
} from 'twenty-sdk/define';

import {
  CAMPAIGN_RELATION_UNIVERSAL_IDENTIFIERS,
  CAMPAIGN_UNIVERSAL_IDENTIFIER,
} from 'src/constants/campaign-forecast-identifiers';
import { LEAD_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: CAMPAIGN_RELATION_UNIVERSAL_IDENTIFIERS.leadsOnCampaign,
  objectUniversalIdentifier: CAMPAIGN_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'leads',
  label: 'Leads',
  icon: 'IconTargetArrow',
  relationTargetObjectMetadataUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    CAMPAIGN_RELATION_UNIVERSAL_IDENTIFIERS.campaignOnLead,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
