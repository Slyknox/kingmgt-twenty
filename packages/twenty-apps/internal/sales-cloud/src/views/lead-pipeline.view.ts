import { defineView, ViewType } from 'twenty-sdk/define';

import { LEAD_STATUS_OPTIONS } from 'src/constants/lead-options';
import {
  LEAD_FIELD_UNIVERSAL_IDENTIFIERS as F,
  LEAD_PIPELINE_VIEW_FIELD_UNIVERSAL_IDENTIFIERS as VIEW_FIELD_IDS,
  LEAD_PIPELINE_VIEW_GROUP_UNIVERSAL_IDENTIFIERS as GROUP_IDS,
  LEAD_PIPELINE_VIEW_UNIVERSAL_IDENTIFIER,
  LEAD_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

const CARD_FIELDS = [F.name, F.companyName, F.rating, F.source];

// Dragging a card into "Converted" runs the conversion (on-lead-status-converted).
export default defineView({
  universalIdentifier: LEAD_PIPELINE_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Lead Pipeline',
  objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  type: ViewType.KANBAN,
  icon: 'IconLayoutKanban',
  position: 1,
  mainGroupByFieldMetadataUniversalIdentifier: F.status,
  fields: CARD_FIELDS.map((field, index) => ({
    universalIdentifier: VIEW_FIELD_IDS[index],
    fieldMetadataUniversalIdentifier: field,
    position: index,
    isVisible: true,
    size: 180,
  })),
  groups: LEAD_STATUS_OPTIONS.map((option, index) => ({
    universalIdentifier: GROUP_IDS[index],
    fieldValue: option.value,
    position: index,
    isVisible: true,
  })),
});
