import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import {
  QUOTE_UNIVERSAL_IDENTIFIER,
  QUOTE_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/quote-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: QUOTE_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIERS.quotes,
  position: 5,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: QUOTE_UNIVERSAL_IDENTIFIER,
});
