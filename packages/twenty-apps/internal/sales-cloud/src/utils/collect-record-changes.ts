import { eventAction, isRemovalAction } from 'src/utils/group-by';

type ChangeEvent = {
  recordId: string;
  properties: {
    updatedFields?: string[];
    before?: Record<string, any> | null;
    after?: Record<string, any> | null;
  };
};

// For each record in a batch: was `trigger` changed, and was `override` set in
// that same edit? A created record counts as a change to `trigger`, with
// `override` set when it was created with a value. Removals yield nothing.
export const collectRecordChanges = (
  batchName: string,
  events: ChangeEvent[],
  {
    trigger,
    override,
    hasValue,
  }: { trigger: string; override: string; hasValue: (value: unknown) => boolean },
): Map<string, { triggerChanged: boolean; overrideSet: boolean }> => {
  const action = eventAction(batchName);
  const changes = new Map<string, { triggerChanged: boolean; overrideSet: boolean }>();

  if (isRemovalAction(action)) {
    return changes;
  }

  const isCreate = action === 'created' || action === 'upserted';

  for (const { recordId, properties } of events) {
    const updatedFields = properties.updatedFields ?? [];
    const change = isCreate
      ? { triggerChanged: true, overrideSet: hasValue(properties.after?.[override]) }
      : {
          triggerChanged: updatedFields.includes(trigger),
          overrideSet: updatedFields.includes(override),
        };
    const previous = changes.get(recordId);

    changes.set(
      recordId,
      previous
        ? {
            triggerChanged: previous.triggerChanged || change.triggerChanged,
            overrideSet: previous.overrideSet || change.overrideSet,
          }
        : change,
    );
  }

  return changes;
};

// Every value a field had before or after the batch's events, e.g. the quote
// a line moved out of and the one it moved into.
export const collectFieldValues = (
  events: ChangeEvent[],
  fieldName: string,
): string[] => {
  const values = new Set<string>();

  for (const { properties } of events) {
    for (const value of [properties.before?.[fieldName], properties.after?.[fieldName]]) {
      if (typeof value === 'string' && value.length > 0) {
        values.add(value);
      }
    }
  }

  return [...values];
};
