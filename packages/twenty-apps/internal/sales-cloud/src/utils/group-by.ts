export const groupBy = <TRecord, TKey>(
  records: TRecord[],
  keyOf: (record: TRecord) => TKey | null | undefined,
): Map<TKey, TRecord[]> => {
  const groups = new Map<TKey, TRecord[]>();

  for (const record of records) {
    const key = keyOf(record);

    if (key !== null && key !== undefined) {
      groups.set(key, [...(groups.get(key) ?? []), record]);
    }
  }

  return groups;
};

export const eventAction = (batchName: string) => batchName.split('.').pop() ?? '';

export const isRemovalAction = (action: string) =>
  action === 'deleted' || action === 'destroyed';
