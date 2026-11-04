import { CoreApiClient } from 'twenty-client-sdk/core';
import { defineLogicFunction } from 'twenty-sdk/define';

import {
  CONVERT_LEADS_LOGIC_FUNCTION,
  LEAD_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';
import { convertLeads } from 'src/utils/convert-leads';
import { type ConvertLeadsInput, toLeadIds } from 'src/utils/to-lead-ids';

const handler = (input: ConvertLeadsInput) =>
  convertLeads({ client: new CoreApiClient(), leadIds: toLeadIds(input) });

export default defineLogicFunction({
  universalIdentifier: CONVERT_LEADS_LOGIC_FUNCTION.universalIdentifier,
  name: 'convert-leads',
  description:
    'Converts leads into a company, person and opportunity, reusing a company with the same name and a person with the same email.',
  timeoutSeconds: 300,
  handler,
  httpRouteTriggerSettings: {
    path: CONVERT_LEADS_LOGIC_FUNCTION.path,
    httpMethod: 'POST',
    isAuthRequired: true,
  },
  workflowActionTriggerSettings: {
    label: 'Convert Lead',
    icon: 'IconTransform',
    inputSchema: [
      {
        type: 'object',
        properties: {
          records: {
            type: 'records',
            objectUniversalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
            label: 'Leads',
          },
        },
      },
    ],
    outputSchema: [
      {
        type: 'object',
        properties: {
          total: { type: 'number', label: 'Total' },
          converted: { type: 'number', label: 'Converted' },
          skipped: { type: 'number', label: 'Skipped' },
          failed: { type: 'number', label: 'Failed' },
        },
      },
    ],
  },
});
