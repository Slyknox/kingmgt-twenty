import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import {
  CASES_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  SUPPORT_CASE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/support-case-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: CASES_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  position: 6,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: SUPPORT_CASE_UNIVERSAL_IDENTIFIER,
});
