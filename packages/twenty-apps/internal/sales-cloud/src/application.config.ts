import { defineApplication } from 'twenty-sdk/define';

import { APPLICATION_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: 'Sales Cloud',
  description:
    'Salesforce-style sales objects for Twenty: leads with one-click conversion into a company, person and opportunity.',
});
