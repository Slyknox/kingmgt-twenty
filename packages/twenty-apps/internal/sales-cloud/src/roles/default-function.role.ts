import { defineApplicationRole } from 'twenty-sdk/define';

import { DEFAULT_FUNCTION_ROLE_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

// Conversion reads leads, creates companies, people and opportunities, and
// soft-deletes them again if a conversion fails halfway. It never destroys.
export default defineApplicationRole({
  universalIdentifier: DEFAULT_FUNCTION_ROLE_UNIVERSAL_IDENTIFIER,
  label: 'Sales Cloud default function role',
  description: 'Role the Sales Cloud app operations run as',
  canReadAllObjectRecords: true,
  canUpdateAllObjectRecords: true,
  canSoftDeleteAllObjectRecords: true,
  canDestroyAllObjectRecords: false,
});
