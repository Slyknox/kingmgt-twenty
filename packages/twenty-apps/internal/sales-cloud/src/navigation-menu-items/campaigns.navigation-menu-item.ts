import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import {
  CAMPAIGN_UNIVERSAL_IDENTIFIER,
  CAMPAIGNS_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
} from 'src/constants/campaign-forecast-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: CAMPAIGNS_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  position: 1,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: CAMPAIGN_UNIVERSAL_IDENTIFIER,
});
