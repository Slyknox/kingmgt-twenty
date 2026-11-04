// Universal identifiers are permanent: once installed in a workspace they key
// the metadata, so never regenerate or reuse one.

export const SUPPORT_CASE_UNIVERSAL_IDENTIFIER = '27a95fbe-a6a8-4ba8-bbee-3a535bc8b8b4';

export const SUPPORT_CASE_FIELD_UNIVERSAL_IDENTIFIERS = {
  subject: '2b072fc9-7e11-4b28-88ca-b349445a6aea',
  status: '8c1850bc-9ffd-414f-bc55-68a4a855c253',
  priority: 'dc0054a4-be0a-4f1a-9646-3c165bfe679f',
  origin: 'a55e295c-edfc-4121-a725-b5df4aacc29b',
  caseType: 'aa2a0332-8555-42e1-85de-15f3a943681e',
  description: '7ae1e5cb-d1de-4f26-bf06-4632516fabcd',
  resolution: '0b6fe4a2-0799-4082-b2ac-4973b73e8941',
  firstRespondedAt: 'd1dbed88-471b-401e-b678-36caffd545be',
  closedAt: '5c9da1e9-e7b6-4d9e-bd56-03367dc8d06a',
  slaDueAt: 'c6dfc5c8-9e76-48ad-b086-2545fc6ec0cc',
  isSlaBreached: '48a65a45-3d4d-41bc-b334-739475ecf2b8',
} as const;

export const SUPPORT_CASE_STATUS_OPTION_IDS = {
  NEW: '95cb4eb3-fcad-4e9f-95aa-bdfdf86cb174',
  WORKING: '81e2d0fa-e0a6-4fed-a716-ba219c36a9e2',
  ESCALATED: '962d217d-1d54-43a1-86ba-191b6eba9967',
  ON_HOLD: 'b9930950-d4db-4c81-b30b-9a2968dbe3eb',
  CLOSED: '3718a19e-1f17-4123-8ce0-04ac38ea1861',
} as const;

export const SUPPORT_CASE_PRIORITY_OPTION_IDS = {
  LOW: 'cf573f26-0f6c-4d77-aecd-1d0547474a69',
  MEDIUM: 'ca7f6f0b-0136-460f-8726-e8c72e8c01ca',
  HIGH: '2fb478d9-37f3-4286-8f7a-e75b29778507',
  CRITICAL: 'dfe04982-4f55-4d97-a5b0-c01d29938540',
} as const;

export const SUPPORT_CASE_ORIGIN_OPTION_IDS = {
  EMAIL: '10297379-2653-42ed-8891-c0e5f2d5630e',
  PHONE: 'd05cd442-4b5e-4416-9701-dd2c56473c74',
  WEB: '678348a2-c8db-49f5-a60c-675ef451b816',
  CHAT: '893087c5-3d66-4488-8dfd-cde6d3ef6f9e',
  OTHER: '41a62511-ca53-4e5e-b7e5-bf548ee4fb1a',
} as const;

export const SUPPORT_CASE_TYPE_OPTION_IDS = {
  QUESTION: '40d8c98f-cf1b-4d51-a05d-be4d1fd4de31',
  PROBLEM: 'c02886df-5910-4ffc-8056-a73da9ef03af',
  FEATURE_REQUEST: '6cb4d0bf-91b5-4fed-b305-4c1109346b56',
  OTHER: '8de50bcd-4403-4d44-9bf3-64f216a9f16e',
} as const;

export const SUPPORT_CASE_RELATION_UNIVERSAL_IDENTIFIERS = {
  companyOnCase: 'c3df285f-edc3-4db0-adc0-4c47a123ce7c',
  supportCasesOnCompany: 'e294389d-5cf6-4754-aad7-1bf51777d134',
  contactOnCase: 'd97b04bf-1106-43d2-968b-04ba1485e1f9',
  supportCasesOnPerson: '214fd7b1-a435-4872-8d98-17cd1bf3a563',
  ownerOnCase: '3329774f-b1c1-4fe2-b1e8-b1713e7132be',
  assignedSupportCasesOnWorkspaceMember: 'd46f894b-75fa-4a71-823e-ab2eb19a0f0d',
} as const;

export const ALL_CASES_VIEW_UNIVERSAL_IDENTIFIER = 'cfb4d25c-f29f-4dc7-9a72-80c202687c08';
export const ALL_CASES_VIEW_FIELD_UNIVERSAL_IDENTIFIERS = [
  'ad924db3-6c5a-4241-afc5-3ca30be256ac',
  'f4e51d4e-248f-422a-9dcd-dd398814fada',
  '2ea854ce-087f-4297-8102-4cea89bd5f22',
  'd1a0c972-171e-4a55-b818-a58ea81310b4',
  '81ee9602-62e7-441b-964d-5716c2857c58',
  '7f14dfa6-1d55-4749-a6d6-d959a05546a1',
  'f32416fc-cf7b-4a70-ae87-bf2dd074826e',
  '5aceb891-da7e-4bd9-8c48-fff6f24bc64f',
] as const;

export const CASE_BOARD_VIEW_UNIVERSAL_IDENTIFIER = 'c869a97c-04c4-4a9f-9eaa-6d95c13efd40';
export const CASE_BOARD_VIEW_FIELD_UNIVERSAL_IDENTIFIERS = [
  '17dc7e53-5385-42cd-8726-1f0edb67d570',
  '65d60907-b7a5-4de6-8e65-36da6457155a',
  '8c8141e5-3a1f-4e1f-92b8-e2ea677dcdc0',
  'd696ab22-fb2d-4ea3-bbbd-3387b1feba25',
] as const;

export const CASE_BOARD_VIEW_GROUP_UNIVERSAL_IDENTIFIERS = [
  '8384c759-f662-4157-aaee-1e7d3d85c00e',
  '08a2b756-345a-4e67-b27f-727cab4907d3',
  '7aedd1f5-56f4-4fbb-8085-c000f91cbe62',
  '77e99ed3-34a4-4261-b00f-d0bf0d47c600',
  '8ef1b394-7057-44fa-a4c4-ddc4d64fb1e9',
] as const;

export const CASES_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER = 'e5a18f81-565f-4267-8423-8a04d16b26c5';
export const SERVICE_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER = '4a8caa9a-c649-4f59-92ac-0886a5cac3d1';

export const SERVICE_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER = 'b8c9015a-65ec-4c8b-907d-604e5de3e503';
export const SERVICE_DASHBOARD_TAB_UNIVERSAL_IDENTIFIER = '4a0949c4-f4ec-43d6-b780-6ec1c21b5286';

export const SERVICE_DASHBOARD_WIDGET_UNIVERSAL_IDENTIFIERS = {
  openCases: 'b3dd5a40-1872-4a7f-b2a4-7805b55f952e',
  breachedCases: '64a48de9-00ff-4fa3-9453-ea2713ad1539',
  openByPriority: '73305e57-3b9a-4b1d-8e92-dd47655ed431',
  byStatus: '64e7a2fe-00f9-4205-a1ee-cda1d153eea9',
} as const;

export const SUPPORT_CASE_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIERS = {
  onSupportCaseChanged: '74807193-55b2-4ac7-9ae1-b7e1bc97fe65',
  flagBreachedCases: '03d8d47c-1be2-41de-ac65-e7e716575aa7',
} as const;
