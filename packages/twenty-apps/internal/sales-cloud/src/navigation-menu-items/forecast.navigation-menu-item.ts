import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import {
  FORECAST_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  FORECAST_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
} from 'src/constants/campaign-forecast-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: FORECAST_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  name: 'Forecast',
  icon: 'IconChartArrows',
  position: 2,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier:
    FORECAST_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
});
