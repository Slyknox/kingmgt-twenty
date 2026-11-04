import { describe, expect, it } from 'vitest';

import { createFakeCrmClient } from 'src/__tests__/fake-crm-client';
import {
  applySupportCaseRules,
  computeSupportCasePatch,
  flagOverdueSupportCases,
} from 'src/utils/compute-support-case';

const CREATED = '2026-11-04T08:00:00.000Z';
const at = (hoursAfterCreation: number) =>
  new Date(Date.parse(CREATED) + hoursAfterCreation * 3_600_000);

describe('computeSupportCasePatch', () => {
  it('sets the deadline from the priority', () => {
    expect(computeSupportCasePatch({ id: 'c', createdAt: CREATED, status: 'NEW', priority: 'HIGH' }, at(1))).toEqual({
      slaDueAt: '2026-11-04T16:00:00.000Z',
    });
  });

  it('moves the deadline when the priority changes', () => {
    expect(
      computeSupportCasePatch({ id: 'c', createdAt: CREATED, status: 'NEW', priority: 'CRITICAL', slaDueAt: '2026-11-04T16:00:00.000Z' }, at(1)),
    ).toEqual({ slaDueAt: '2026-11-04T12:00:00.000Z' });
  });

  it('records the first response and the close, on time', () => {
    expect(
      computeSupportCasePatch({ id: 'c', createdAt: CREATED, status: 'CLOSED', priority: 'MEDIUM', slaDueAt: '2026-11-05T08:00:00.000Z' }, at(3)),
    ).toEqual({ closedAt: at(3).toISOString(), firstRespondedAt: at(3).toISOString() });
  });

  it('marks a case closed after its deadline as overdue', () => {
    expect(
      computeSupportCasePatch({ id: 'c', createdAt: CREATED, status: 'CLOSED', priority: 'CRITICAL', slaDueAt: '2026-11-04T12:00:00.000Z', firstRespondedAt: CREATED }, at(5)),
    ).toEqual({ closedAt: at(5).toISOString(), isSlaBreached: true });
  });

  it('clears the close time when a case is reopened, keeping the first response', () => {
    expect(
      computeSupportCasePatch({ id: 'c', createdAt: CREATED, status: 'WORKING', priority: 'LOW', slaDueAt: '2026-11-07T08:00:00.000Z', closedAt: at(2).toISOString(), firstRespondedAt: at(1).toISOString() }, at(10)),
    ).toEqual({ closedAt: null });
  });

  it('has nothing to write on its own output, so the trigger cannot loop', () => {
    const supportCase = { id: 'c', createdAt: CREATED, status: 'WORKING', priority: 'MEDIUM' };
    const patch = computeSupportCasePatch(supportCase, at(2))!;

    expect(computeSupportCasePatch({ ...supportCase, ...patch }, at(2))).toBeNull();
  });
});

describe('overdue check', () => {
  it('flags only open cases past their deadline', async () => {
    const { client, tables } = createFakeCrmClient({
      supportCase: [
        { id: 'late', createdAt: CREATED, status: 'WORKING', priority: 'CRITICAL', slaDueAt: '2026-11-04T12:00:00.000Z', firstRespondedAt: CREATED, isSlaBreached: false },
        { id: 'fine', createdAt: CREATED, status: 'NEW', priority: 'LOW', slaDueAt: '2026-11-07T08:00:00.000Z', isSlaBreached: false },
        { id: 'closed', createdAt: CREATED, status: 'CLOSED', priority: 'CRITICAL', slaDueAt: '2026-11-04T12:00:00.000Z', closedAt: at(1).toISOString(), firstRespondedAt: CREATED, isSlaBreached: false },
      ],
    });

    expect(await flagOverdueSupportCases(client, at(6))).toBe(1);
    expect(tables.supportCase.map((supportCase) => supportCase.isSlaBreached)).toEqual([true, false, false]);
  });

  it('applies the rules to the changed cases', async () => {
    const { client, tables } = createFakeCrmClient({
      supportCase: [{ id: 'c', createdAt: CREATED, status: 'NEW', priority: 'MEDIUM' }],
    });

    await applySupportCaseRules(client, ['c', 'c'], at(1));

    expect(tables.supportCase[0].slaDueAt).toBe('2026-11-05T08:00:00.000Z');
  });
});
