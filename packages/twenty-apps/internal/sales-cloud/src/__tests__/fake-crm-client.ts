import { type CrmClient } from 'src/utils/lead-conversion-types';

type Row = Record<string, any> & { id: string };

const TABLE_BY_QUERY: Record<string, string> = {
  leads: 'lead',
  companies: 'company',
  people: 'person',
  opportunities: 'opportunity',
  campaigns: 'campaign',
};

const unescapeLike = (pattern: string) => pattern.replace(/\\(.)/g, '$1');

const matchesCondition = (value: any, condition: Record<string, any>): boolean => {
  if ('in' in condition) return condition.in.includes(value);
  if ('eq' in condition) return value === condition.eq;
  if ('is' in condition) return condition.is === 'NULL' ? value == null : value != null;
  if ('ilike' in condition) {
    return String(value ?? '').toLowerCase() === unescapeLike(condition.ilike).toLowerCase();
  }
  throw new Error(`fake client: unsupported condition ${JSON.stringify(condition)}`);
};

const matches = (row: Row, filter: Record<string, any> | undefined): boolean =>
  !filter ||
  Object.entries(filter).every(([key, condition]) => {
    if (key === 'or') return condition.some((branch: any) => matches(row, branch));
    if (key === 'emails') return matchesCondition(row.emails?.primaryEmail, condition.primaryEmail);
    return matchesCondition(row[key], condition);
  });

// Interprets the request shapes the app sends, against in-memory tables:
// filters, cursor paging, create/update/delete. A test can make one
// mutation throw through failOn.
export const createFakeCrmClient = (seed: Partial<Record<string, Row[]>>) => {
  const tables: Record<string, Row[]> = {
    lead: [], company: [], person: [], opportunity: [], campaign: [],
    ...Object.fromEntries(Object.entries(seed).map(([name, rows]) => [name, rows!.map((row) => ({ ...row }))])),
  };
  const deleted: { object: string; id: string }[] = [];
  const updates: { object: string; id: string; data: Record<string, any> }[] = [];
  const failOn = new Set<string>();
  let sequence = 0;

  const client: CrmClient = {
    query: async (request) => {
      const [queryName, { __args }] = Object.entries(request)[0] as [string, any];
      const rows = tables[TABLE_BY_QUERY[queryName]].filter(
        (row) => !row.deletedAt && matches(row, __args.filter),
      );
      const start = __args.after ? Number(__args.after) : 0;
      const page = rows.slice(start, start + __args.first);
      const end = start + page.length;
      return {
        [queryName]: {
          edges: page.map((node) => ({ node })),
          pageInfo: { hasNextPage: end < rows.length, endCursor: String(end) },
        },
      };
    },
    mutation: async (request) => {
      const [mutationName, { __args }] = Object.entries(request)[0] as [string, any];

      if (failOn.has(mutationName)) {
        throw new Error(`${mutationName} rejected`);
      }

      const [, verb, object] = mutationName.match(/^(create|update|delete)(\w+)$/)!;
      const table = tables[object.charAt(0).toLowerCase() + object.slice(1)];

      if (verb === 'create') {
        const row = { id: `${object.toLowerCase()}-${++sequence}`, ...__args.data };
        table.push(row);
        return { [mutationName]: { id: row.id } };
      }

      const row = table.find((candidate) => candidate.id === __args.id)!;

      if (verb === 'update') {
        Object.assign(row, __args.data);
        updates.push({ object, id: row.id, data: __args.data });
      } else {
        row.deletedAt = 'now';
        deleted.push({ object, id: row.id });
      }
      return { [mutationName]: { id: row.id } };
    },
  };

  return { client, tables, deleted, updates, failOn };
};
