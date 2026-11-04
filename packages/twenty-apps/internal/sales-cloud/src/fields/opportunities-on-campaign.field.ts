import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  CAMPAIGN_RELATION_UNIVERSAL_IDENTIFIERS,
  CAMPAIGN_UNIVERSAL_IDENTIFIER,
} from 'src/constants/campaign-forecast-identifiers';

export default defineField({
  universalIdentifier: CAMPAIGN_RELATION_UNIVERSAL_IDENTIFIERS.opportunitiesOnCampaign,
  objectUniversalIdentifier: CAMPAIGN_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'opportunities',
  label: 'Opportunities',
  icon: 'IconTargetArrow',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    CAMPAIGN_RELATION_UNIVERSAL_IDENTIFIERS.campaignOnOpportunity,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
