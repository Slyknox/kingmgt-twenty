import {
  OPEN_SUPPORT_CASE_STATUSES,
  SLA_HOURS_BY_PRIORITY,
  type SupportCasePriority,
  SupportCaseStatus,
} from 'src/constants/support-case-options';
import { fetchAll } from 'src/utils/fetch-all';
import { type CrmClient } from 'src/utils/lead-conversion-types';

export type SupportCaseRecord = {
  id: string;
  createdAt?: string | null;
  status?: string | null;
  priority?: string | null;
  firstRespondedAt?: string | null;
  closedAt?: string | null;
  slaDueAt?: string | null;
  isSlaBreached?: boolean | null;
};

const HOUR_MS = 60 * 60 * 1000;

const sameInstant = (left?: string | null, right?: string | null) =>
  (left ? Date.parse(left) : null) === (right ? Date.parse(right) : null);

// Everything is derived from the case's current state, so running it twice
// changes nothing the second time and the trigger cannot loop.
export const computeSupportCasePatch = (
  supportCase: SupportCaseRecord,
  now: Date,
): Record<string, unknown> | null => {
  const patch: Record<string, unknown> = {};
  const isClosed = supportCase.status === SupportCaseStatus.CLOSED;
  const hours = SLA_HOURS_BY_PRIORITY[supportCase.priority as SupportCasePriority];
  const slaDueAt =
    supportCase.createdAt && hours !== undefined
      ? new Date(Date.parse(supportCase.createdAt) + hours * HOUR_MS).toISOString()
      : (supportCase.slaDueAt ?? null);

  if (!sameInstant(slaDueAt, supportCase.slaDueAt)) {
    patch.slaDueAt = slaDueAt;
  }

  let closedAt = supportCase.closedAt ?? null;

  if (isClosed && !closedAt) {
    closedAt = now.toISOString();
    patch.closedAt = closedAt;
  } else if (!isClosed && closedAt) {
    // Reopened: the case is open again, so it can go overdue again.
    closedAt = null;
    patch.closedAt = null;
  }

  if (
    supportCase.status &&
    supportCase.status !== SupportCaseStatus.NEW &&
    !supportCase.firstRespondedAt
  ) {
    patch.firstRespondedAt = closedAt ?? now.toISOString();
  }

  const isSlaBreached = slaDueAt
    ? Date.parse(closedAt ?? now.toISOString()) > Date.parse(slaDueAt)
    : false;

  if (isSlaBreached !== Boolean(supportCase.isSlaBreached)) {
    patch.isSlaBreached = isSlaBreached;
  }

  return Object.keys(patch).length > 0 ? patch : null;
};

const CASE_SELECTION = {
  id: true,
  createdAt: true,
  status: true,
  priority: true,
  firstRespondedAt: true,
  closedAt: true,
  slaDueAt: true,
  isSlaBreached: true,
};

const writePatches = async (
  client: CrmClient,
  supportCases: SupportCaseRecord[],
  now: Date,
): Promise<number> => {
  let updated = 0;

  for (const supportCase of supportCases) {
    const patch = computeSupportCasePatch(supportCase, now);

    if (patch) {
      await client.mutation({
        updateSupportCase: { __args: { id: supportCase.id, data: patch }, id: true },
      });
      updated++;
    }
  }

  return updated;
};

export const applySupportCaseRules = async (
  client: CrmClient,
  caseIds: string[],
  now: Date = new Date(),
): Promise<number> => {
  const ids = [...new Set(caseIds)];

  if (ids.length === 0) {
    return 0;
  }

  return writePatches(
    client,
    await fetchAll<SupportCaseRecord>(client, 'supportCases', { id: { in: ids } }, CASE_SELECTION),
    now,
  );
};

// A case goes overdue just by time passing, with no edit to trigger on, so an
// hourly job flags open cases whose deadline has gone by.
export const flagOverdueSupportCases = async (
  client: CrmClient,
  now: Date = new Date(),
): Promise<number> =>
  writePatches(
    client,
    await fetchAll<SupportCaseRecord>(
      client,
      'supportCases',
      {
        status: { in: OPEN_SUPPORT_CASE_STATUSES },
        isSlaBreached: { eq: false },
        slaDueAt: { lt: now.toISOString() },
      },
      CASE_SELECTION,
    ),
    now,
  );
