import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import {
  EXCHANGE_RATE_UNIVERSAL_IDENTIFIER,
  EXCHANGE_RATES_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
} from 'src/constants/exchange-rate-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: EXCHANGE_RATES_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  position: 9,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: EXCHANGE_RATE_UNIVERSAL_IDENTIFIER,
});
