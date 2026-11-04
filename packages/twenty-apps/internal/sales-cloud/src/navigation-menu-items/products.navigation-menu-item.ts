import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import {
  PRODUCT_UNIVERSAL_IDENTIFIER,
  QUOTE_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/quote-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: QUOTE_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIERS.products,
  position: 3,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: PRODUCT_UNIVERSAL_IDENTIFIER,
});
