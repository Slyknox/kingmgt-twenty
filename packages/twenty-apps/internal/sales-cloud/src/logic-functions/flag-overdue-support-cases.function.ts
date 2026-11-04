import { defineLogicFunction } from 'twenty-sdk/define';

import { SUPPORT_CASE_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIERS as IDS } from 'src/constants/support-case-identifiers';
import { appClient } from 'src/utils/app-client';
import { flagOverdueSupportCases } from 'src/utils/compute-support-case';

export default defineLogicFunction({
  universalIdentifier: IDS.flagBreachedCases,
  name: 'flag-overdue-support-cases',
  description: 'Marks open cases past their deadline as overdue.',
  timeoutSeconds: 300,
  cronTriggerSettings: { pattern: '7 * * * *' },
  handler: () => flagOverdueSupportCases(appClient()),
});
