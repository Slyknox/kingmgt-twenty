import { type CrmClient } from 'src/utils/lead-conversion-types';

type Row = Record<string, any> & { id: string };

const TABLE_BY_QUERY: Record<string, string> = {
  leads: 'lead',
  companies: 'company',
  people: 'person',
  opportunities: 'opportunity',
  campaigns: 'campaign',
  products: 'product',
  priceBooks: 'priceBook',
  priceBookEntries: 'priceBookEntry',
  quotes: 'quote',
  quoteLineItems: 'quoteLineItem',
  supportCases: 'supportCase',
  campaignMembers: 'campaignMember',
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
    if (key === 'domainName') return matchesCondition(row.domainName?.primaryLinkUrl, condition.primaryLinkUrl);
    return matchesCondition(row[key], condition);
  });

// Resolves a nested selection like `product: { name: true }` through the
// row's productId, as the real API does for many-to-one relations.
const withRelations = (row: Row, _args: unknown, selection: any): Row => {
  const resolved: Row = { ...row };

  for (const [key, value] of Object.entries(selection.edges?.node ?? {})) {
    const relatedId = row[`${key}Id`];

    if (value && typeof value === 'object' && typeof relatedId === 'string') {
      resolved[key] = currentTables[key]?.find((candidate) => candidate.id === relatedId) ?? null;
    }
  }

  return resolved;
};

let currentTables: Record<string, Row[]> = {};

// Interprets the request shapes the app sends, against in-memory tables:
// filters, cursor paging, create/update/delete. A test can make one
// mutation throw through failOn.
export const createFakeCrmClient = (seed: Partial<Record<string, Row[]>>) => {
  const tables: Record<string, Row[]> = {
    lead: [], company: [], person: [], opportunity: [], campaign: [],
    product: [], priceBook: [], priceBookEntry: [], quote: [], quoteLineItem: [],
    supportCase: [], campaignMember: [],
    ...Object.fromEntries(Object.entries(seed).map(([name, rows]) => [name, rows!.map((row) => ({ ...row }))])),
  };
  currentTables = tables;
  const deleted: { object: string; id: string }[] = [];
  const destroyed: { object: string; id: string }[] = [];
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
          edges: page.map((node) => ({ node: withRelations(node, __args, request[queryName]) })),
          pageInfo: { hasNextPage: end < rows.length, endCursor: String(end) },
        },
      };
    },
    mutation: async (request) => {
      const [mutationName, { __args }] = Object.entries(request)[0] as [string, any];

      if (failOn.has(mutationName)) {
        throw new Error(`${mutationName} rejected`);
      }

      const [, verb, object] = mutationName.match(/^(create|update|delete|destroy)(\w+)$/)!;
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
      } else if (verb === 'delete') {
        row.deletedAt = 'now';
        deleted.push({ object, id: row.id });
      } else {
        table.splice(table.indexOf(row), 1);
        destroyed.push({ object, id: row.id });
      }
      return { [mutationName]: { id: row.id } };
    },
  };

  return { client, tables, deleted, destroyed, updates, failOn };
};
