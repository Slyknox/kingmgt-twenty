import { defineCommandMenuItem, isSelectAll } from 'twenty-sdk/define';

import {
  CONVERT_LEADS_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  CONVERT_LEADS_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  LEAD_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineCommandMenuItem({
  universalIdentifier: CONVERT_LEADS_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  availabilityObjectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  frontComponentUniversalIdentifier:
    CONVERT_LEADS_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  label: 'Convert lead',
  availabilityType: 'RECORD_SELECTION',
  // "Select all" sends no ids, and conversion is capped per call anyway.
  conditionalAvailabilityExpression: !isSelectAll,
});
