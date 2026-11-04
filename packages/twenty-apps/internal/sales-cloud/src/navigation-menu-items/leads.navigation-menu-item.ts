import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import {
  LEAD_UNIVERSAL_IDENTIFIER,
  LEADS_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: LEADS_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  position: 0,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
});
