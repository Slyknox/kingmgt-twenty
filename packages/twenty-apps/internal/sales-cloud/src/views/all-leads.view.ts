import { defineView, ViewType } from 'twenty-sdk/define';

import {
  ALL_LEADS_VIEW_FIELD_UNIVERSAL_IDENTIFIERS as VIEW_FIELD_IDS,
  ALL_LEADS_VIEW_UNIVERSAL_IDENTIFIER,
  LEAD_FIELD_UNIVERSAL_IDENTIFIERS as F,
  LEAD_RELATION_UNIVERSAL_IDENTIFIERS,
  LEAD_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

const COLUMNS = [
  { field: F.name, size: 200 },
  { field: F.companyName, size: 180 },
  { field: F.status, size: 140 },
  { field: F.rating, size: 110 },
  { field: F.source, size: 140 },
  { field: F.emails, size: 200 },
  { field: F.phones, size: 160 },
  { field: LEAD_RELATION_UNIVERSAL_IDENTIFIERS.convertedOpportunityOnLead, size: 200 },
];

export default defineView({
  universalIdentifier: ALL_LEADS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'All Leads',
  objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
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
