import { type CrmClient } from 'src/utils/lead-conversion-types';

const PAGE_SIZE = 200;
const MAX_PAGES = 50;

// Reads every record matching a filter, page by page. Capped so a huge
// workspace can't keep a logic function running past its timeout; the
// nightly recompute picks up anything beyond the cap.
export const fetchAll = async <TNode>(
  client: CrmClient,
  queryName: string,
  filter: Record<string, unknown> | undefined,
  selection: Record<string, unknown>,
): Promise<TNode[]> => {
  const nodes: TNode[] = [];
  let after: string | undefined;

  for (let page = 0; page < MAX_PAGES; page++) {
    const response = await client.query({
      [queryName]: {
        __args: {
          ...(filter ? { filter } : {}),
          first: PAGE_SIZE,
          ...(after ? { after } : {}),
        },
        edges: { node: selection },
        pageInfo: { hasNextPage: true, endCursor: true },
      },
    });
    const connection = response[queryName];

    for (const edge of connection?.edges ?? []) {
      nodes.push(edge.node as TNode);
    }

    if (!connection?.pageInfo?.hasNextPage || !connection.pageInfo.endCursor) {
      break;
    }

    after = connection.pageInfo.endCursor;
  }

  return nodes;
};
