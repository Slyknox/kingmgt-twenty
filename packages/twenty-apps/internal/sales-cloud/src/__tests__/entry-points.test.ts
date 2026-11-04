import { describe, expect, it } from 'vitest';

import { selectLeadIdsToConvert } from 'src/logic-functions/on-lead-status-converted.function';
import { buildConversionSnackbar } from 'src/utils/build-conversion-snackbar';
import { toLeadIds } from 'src/utils/to-lead-ids';

describe('toLeadIds', () => {
  it('reads ids from the Convert lead button route body', () => {
    expect(toLeadIds({ requestContext: {}, body: { recordIds: ['a', 'b'] } })).toEqual(['a', 'b']);
  });

  it('reads one or many records from a workflow action', () => {
    expect(toLeadIds({ records: { id: 'a' } })).toEqual(['a']);
    expect(toLeadIds({ records: ['a', { id: 'b' }, { id: null }, ''] })).toEqual(['a', 'b']);
  });

  it('returns nothing for a missing or malformed input', () => {
    expect(toLeadIds(undefined)).toEqual([]);
    expect(toLeadIds({ requestContext: {}, body: null })).toEqual([]);
  });
});

describe('selectLeadIdsToConvert', () => {
  it('converts leads moved to Converted and ignores the write conversion makes itself', () => {
    expect(
      selectLeadIdsToConvert([
        { recordId: 'dragged', properties: { after: { status: 'CONVERTED' } } },
        { recordId: 'by-conversion', properties: { after: { status: 'CONVERTED', convertedOpportunityId: 'o1' } } },
        { recordId: 'other-status', properties: { after: { status: 'WORKING' } } },
      ]),
    ).toEqual(['dragged']);
  });
});

describe('buildConversionSnackbar', () => {
  it('reports success, partial failure and total failure', () => {
    expect(buildConversionSnackbar({ total: 1, converted: 1, skipped: 0, failed: 0, results: [] }))
      .toEqual({ message: 'Converted 1 lead.', variant: 'success' });
    expect(
      buildConversionSnackbar({
        total: 2, converted: 1, skipped: 0, failed: 1,
        results: [{ leadId: 'x', status: 'failed', error: 'boom' }],
      }),
    ).toEqual({ message: 'Converted 1 of 2 leads; 1 failed.', variant: 'warning', detailedMessage: 'boom' });
    expect(
      buildConversionSnackbar({
        total: 1, converted: 0, skipped: 0, failed: 1,
        results: [{ leadId: 'x', status: 'failed', error: 'boom' }],
      }).variant,
    ).toBe('error');
    expect(buildConversionSnackbar({ total: 1, converted: 0, skipped: 1, failed: 0, results: [] }).variant)
      .toBe('warning');
  });
});
