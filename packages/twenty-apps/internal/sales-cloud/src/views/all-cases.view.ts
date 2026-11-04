import { defineView, ViewType } from 'twenty-sdk/define';

import {
  ALL_CASES_VIEW_FIELD_UNIVERSAL_IDENTIFIERS as VIEW_FIELD_IDS,
  ALL_CASES_VIEW_UNIVERSAL_IDENTIFIER,
  SUPPORT_CASE_FIELD_UNIVERSAL_IDENTIFIERS as F,
  SUPPORT_CASE_RELATION_UNIVERSAL_IDENTIFIERS as R,
  SUPPORT_CASE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/support-case-identifiers';

const COLUMNS = [
  { field: F.subject, size: 260 },
  { field: F.status, size: 120 },
  { field: F.priority, size: 110 },
  { field: R.companyOnCase, size: 180 },
  { field: R.contactOnCase, size: 160 },
  { field: R.ownerOnCase, size: 160 },
  { field: F.slaDueAt, size: 150 },
  { field: F.isSlaBreached, size: 100 },
];

export default defineView({
  universalIdentifier: ALL_CASES_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'All Cases',
  objectUniversalIdentifier: SUPPORT_CASE_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconList',
  position: 0,
  fields: COLUMNS.map(({ field, size }, index) => ({
    universalIdentifier: VIEW_FIELD_IDS[index],
    fieldMetadataUniversalIdentifier: field,
    position: index,
    isVisible: true,
    size,
  })),
});
