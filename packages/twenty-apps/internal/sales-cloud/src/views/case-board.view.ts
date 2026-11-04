import { defineView, ViewType } from 'twenty-sdk/define';

import {
  CASE_BOARD_VIEW_FIELD_UNIVERSAL_IDENTIFIERS as VIEW_FIELD_IDS,
  CASE_BOARD_VIEW_GROUP_UNIVERSAL_IDENTIFIERS as GROUP_IDS,
  CASE_BOARD_VIEW_UNIVERSAL_IDENTIFIER,
  SUPPORT_CASE_FIELD_UNIVERSAL_IDENTIFIERS as F,
  SUPPORT_CASE_RELATION_UNIVERSAL_IDENTIFIERS as R,
  SUPPORT_CASE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/support-case-identifiers';
import { SUPPORT_CASE_STATUS_OPTIONS } from 'src/constants/support-case-options';

const CARD_FIELDS = [F.subject, F.priority, R.companyOnCase, F.slaDueAt];

export default defineView({
  universalIdentifier: CASE_BOARD_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Case Board',
  objectUniversalIdentifier: SUPPORT_CASE_UNIVERSAL_IDENTIFIER,
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
  groups: SUPPORT_CASE_STATUS_OPTIONS.map((option, index) => ({
    universalIdentifier: GROUP_IDS[index],
    fieldValue: option.value,
    position: index,
    isVisible: true,
  })),
});
