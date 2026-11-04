import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import {
  PRICE_BOOK_UNIVERSAL_IDENTIFIER,
  QUOTE_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/quote-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: QUOTE_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIERS.priceBooks,
  position: 4,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: PRICE_BOOK_UNIVERSAL_IDENTIFIER,
});
