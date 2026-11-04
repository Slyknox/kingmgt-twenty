import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import {
  SERVICE_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  SERVICE_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
} from 'src/constants/support-case-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: SERVICE_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Service',
  icon: 'IconLifebuoy',
  position: 7,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: SERVICE_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
});
