import { type CrmClient } from 'src/utils/lead-conversion-types';

type Row = Record<string, any> & { id: string };

const COLLECTION_BY_QUERY: Record<string, string> = {
  leads: 'lead',
  companies: 'company',
  people: 'person',
};

const unescapeLike = (pattern: string) => pattern.replace(/\\(.)/g, '$1');

const matches = (row: Row, filter: Record<string, any>): boolean =>
  Object.entries(filter).every(([key, condition]) => {
    if (key === 'id' && condition.in) {
      return condition.in.includes(row.id);
    }
    if (key === 'name' && 'ilike' in condition) {
      return (
        String(row.name ?? '').toLowerCase() ===
        unescapeLike(condition.ilike).toLowerCase()
      );
    }
    if (key === 'emails') {
      return (
        String(row.emails?.primaryEmail ?? '').toLowerCase() ===
        unescapeLike(condition.primaryEmail.ilike).toLowerCase()
      );
    }
    throw new Error(`fake client: unsupported filter ${key}`);
  });

// Interprets just the request shapes convert-leads sends, against in-memory
// tables, and lets a test make one mutation throw.
export const createFakeCrmClient = (seed: {
  lead?: Row[];
  company?: Row[];
  person?: Row[];
}) => {
  const tables: Record<string, Row[]> = {
    lead: seed.lead ?? [],
    company: seed.company ?? [],
    person: seed.person ?? [],
    opportunity: [],
  };
  const deleted: { object: string; id: string }[] = [];
  const failOn = new Set<string>();
  let sequence = 0;

  const client: CrmClient = {
    query: async (request) => {
      const [queryName, { __args }] = Object.entries(request)[0] as [string, any];
      const rows = tables[COLLECTION_BY_QUERY[queryName]].filter(
        (row) => !row.deletedAt && matches(row, __args.filter),
      );
      return {
        [queryName]: {
          edges: rows.slice(0, __args.first).map((node) => ({ node })),
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
      } else {
        row.deletedAt = 'now';
        deleted.push({ object, id: row.id });
      }
      return { [mutationName]: { id: row.id } };
    },
  };

  return { client, tables, deleted, failOn };
};
