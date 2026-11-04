type RecordInput = string | { id?: string | null } | null | undefined;

export type ConvertLeadsInput =
  | { records?: RecordInput | RecordInput[] }
  | { requestContext: unknown; body?: { recordIds?: unknown } | null };

const isRoutePayload = (
  input: ConvertLeadsInput,
): input is { requestContext: unknown; body?: { recordIds?: unknown } | null } =>
  typeof input === 'object' && input !== null && 'requestContext' in input;

const toId = (record: RecordInput): string | undefined => {
  if (typeof record === 'string') {
    return record;
  }

  return typeof record?.id === 'string' ? record.id : undefined;
};

// Accepts the HTTP route body ({ recordIds }) from the "Convert lead" button
// and the workflow action input ({ records }), which may be one record or many.
export const toLeadIds = (input: ConvertLeadsInput | null | undefined): string[] => {
  if (!input) {
    return [];
  }

  const rawRecords: unknown = isRoutePayload(input)
    ? input.body?.recordIds
    : input.records;

  const records = Array.isArray(rawRecords) ? rawRecords : [rawRecords];

  return records
    .map((record) => toId(record as RecordInput))
    .filter((id): id is string => typeof id === 'string' && id.length > 0);
};
