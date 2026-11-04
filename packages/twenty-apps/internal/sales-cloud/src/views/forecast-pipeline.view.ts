import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewType,
} from 'twenty-sdk/define';

import {
  CAMPAIGN_RELATION_UNIVERSAL_IDENTIFIERS,
  FORECAST_FIELD_UNIVERSAL_IDENTIFIERS,
  FORECAST_PIPELINE_VIEW_FIELD_UNIVERSAL_IDENTIFIERS as VIEW_FIELD_IDS,
  FORECAST_PIPELINE_VIEW_GROUP_UNIVERSAL_IDENTIFIERS as GROUP_IDS,
  FORECAST_PIPELINE_VIEW_UNIVERSAL_IDENTIFIER,
} from 'src/constants/campaign-forecast-identifiers';
import { FORECAST_CATEGORY_OPTIONS } from 'src/constants/forecast-options';

const opportunity = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity;

const CARD_FIELDS = [
  opportunity.fields.name.universalIdentifier,
  opportunity.fields.amount.universalIdentifier,
  FORECAST_FIELD_UNIVERSAL_IDENTIFIERS.probability,
  FORECAST_FIELD_UNIVERSAL_IDENTIFIERS.expectedRevenue,
  opportunity.fields.closeDate.universalIdentifier,
  CAMPAIGN_RELATION_UNIVERSAL_IDENTIFIERS.campaignOnOpportunity,
];

// Dragging a card moves the deal between forecast categories without
// changing its stage.
export default defineView({
  universalIdentifier: FORECAST_PIPELINE_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Forecast',
  objectUniversalIdentifier: opportunity.universalIdentifier,
  type: ViewType.KANBAN,
  icon: 'IconChartArrows',
  position: 10,
  mainGroupByFieldMetadataUniversalIdentifier:
    FORECAST_FIELD_UNIVERSAL_IDENTIFIERS.forecastCategory,
  fields: CARD_FIELDS.map((field, index) => ({
    universalIdentifier: VIEW_FIELD_IDS[index],
    fieldMetadataUniversalIdentifier: field,
    position: index,
    isVisible: true,
    size: 160,
  })),
  groups: FORECAST_CATEGORY_OPTIONS.map((option, index) => ({
    universalIdentifier: GROUP_IDS[index],
    fieldValue: option.value,
    position: index,
    isVisible: true,
  })),
});
