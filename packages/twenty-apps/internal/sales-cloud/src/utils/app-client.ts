import { CoreApiClient } from 'twenty-client-sdk/core';

// Background work (forecasts, campaign results, quote totals, case deadlines)
// runs with the app's own role. With the triggering user's token it would see
// only the records that user may read, and write totals that are too small.
export const appClient = () => new CoreApiClient({ runAs: 'application' });
