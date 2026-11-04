import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import {
  CAMPAIGN_MEMBER_UNIVERSAL_IDENTIFIER,
  CAMPAIGN_MEMBERS_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
} from 'src/constants/campaign-forecast-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: CAMPAIGN_MEMBERS_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  position: 8,
  type: NavigationMenuItemType.OBJECT,
  targetObjectUniversalIdentifier: CAMPAIGN_MEMBER_UNIVERSAL_IDENTIFIER,
});
