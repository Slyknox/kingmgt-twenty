/// <reference types="vite/client" />
import { describe, expect, it } from 'vitest';

// Copied from twenty-shared's RESERVED_METADATA_NAME_KEYWORDS
// (src/metadata/constants/reserved-metadata-name-keywords.constant.ts), which
// the SDK doesn't export. The server refuses to install an app that uses one.
const RESERVED_METADATA_NAME_KEYWORDS = [
  'approvedAccessDomain', 'approvedAccessDomains', 'appToken', 'appTokens',
  'billingCustomer', 'billingCustomers', 'billingEntitlement', 'billingEntitlements',
  'billingMeter', 'billingMeters', 'billingProduct', 'billingProducts',
  'billingSubscription', 'billingSubscriptions', 'billingSubscriptionItem',
  'billingSubscriptionItems', 'featureFlag', 'featureFlags', 'job', 'jobs',
  'keyValuePair', 'keyValuePairs', 'pageLayout', 'pageLayouts', 'pageLayoutTab',
  'pageLayoutTabs', 'pageLayoutWidget', 'pageLayoutWidgets', 'twoFactorMethod',
  'twoFactorMethods', 'user', 'users', 'userWorkspace', 'userWorkspaces',
  'workspace', 'workspaces', 'role', 'roles', 'userWorkspaceRole',
  'userWorkspaceRoles', 'plan', 'plans', 'event', 'events', 'field', 'fields',
  'link', 'links', 'currency', 'currencies', 'fullNames', 'address', 'addresses',
  'type', 'types', 'object', 'objects', 'index', 'relation', 'relations',
  'aggregate', 'connect', 'create', 'disconnect', 'search', 'searches',
];

type Definition = {
  config: {
    name?: string;
    nameSingular?: string;
    namePlural?: string;
    fields?: { name: string }[];
  };
};

const OBJECTS = import.meta.glob<{ default: Definition }>('../objects/*.ts', { eager: true });
const FIELDS = import.meta.glob<{ default: Definition }>('../fields/*.ts', { eager: true });

const names = [
  ...Object.values(OBJECTS).flatMap(({ default: { config } }) => [
    config.nameSingular!,
    config.namePlural!,
    ...(config.fields ?? []).map((field) => field.name),
  ]),
  ...Object.values(FIELDS).map(({ default: { config } }) => config.name!),
];

describe('metadata names', () => {
  it('reads every object and field definition', () => {
    expect(Object.keys(OBJECTS).length).toBeGreaterThan(0);
    expect(Object.keys(FIELDS).length).toBeGreaterThan(0);
    expect(names.every((name) => typeof name === 'string')).toBe(true);
  });

  it('uses no name the Twenty server reserves', () => {
    expect(names.filter((name) => RESERVED_METADATA_NAME_KEYWORDS.includes(name))).toEqual([]);
  });
});
