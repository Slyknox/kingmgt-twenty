// Universal identifiers are permanent: once installed in a workspace they key
// the metadata, so never regenerate or reuse one.
export const APPLICATION_UNIVERSAL_IDENTIFIER =
  '305d6452-455f-4ee8-8f6e-d9d5e65b0b30';

export const LEAD_UNIVERSAL_IDENTIFIER = '2f6924f3-5530-42c5-9bc0-7877d019bb71';

export const LEAD_FIELD_UNIVERSAL_IDENTIFIERS = {
  name: '9587d67c-5bcc-4c4a-a130-a0f670d91abe',
  companyName: 'e34aaedc-9689-4ee8-8a23-f4877700d97c',
  jobTitle: '959ace37-6853-4b44-8fa6-11620aa183e2',
  emails: '2bec1654-a6ee-4418-9580-f0726191a8e2',
  phones: '1499c9d0-2fff-4d5d-8f40-0833fe80ff23',
  website: '918b7cb4-593b-4ad2-b4bf-5303dcca4692',
  status: '49f9607e-96b4-4006-bc5c-790117df09f6',
  source: 'df27bf08-616e-40b2-ae3f-686f31e46f6c',
  rating: 'dae129be-ee24-47fd-92e7-978927cf775d',
  annualRevenue: 'a42ef380-2aab-48cf-bcd9-4f58dde3569a',
  employees: '2fe635cf-2bdb-43ec-81b5-8d31a67bd9fc',
  description: '96ebf3ce-e270-44fe-824c-986309aa7f20',
  convertedAt: 'd788e6a1-880d-4369-bf56-75e1bb98a11c',
  conversionError: 'dce518d7-153a-4615-947b-d696d8238906',
} as const;

// Each relation is a pair: the many-to-one side on the lead, and the
// one-to-many inverse on the standard object.
export const LEAD_RELATION_UNIVERSAL_IDENTIFIERS = {
  convertedCompanyOnLead: '44af4cba-cb76-402c-9c65-20ddef66b768',
  convertedLeadsOnCompany: 'f60187af-5091-43ec-9374-72d879e503fc',
  convertedPersonOnLead: '80cda365-c970-43cd-b0b8-da3887a81756',
  convertedLeadsOnPerson: '1f21c290-c273-42da-a41b-fae85a12c3d0',
  convertedOpportunityOnLead: '5d27d56a-1b93-43aa-88fd-6acc1058d901',
  convertedLeadsOnOpportunity: '4f15241a-c383-483b-a370-d97332bbc61e',
} as const;

export const LEAD_STATUS_OPTION_IDS = {
  NEW: '7f156bda-3c0d-4866-b129-f352c3119d8e',
  WORKING: '5ab1f6d7-6931-40a8-b45f-504815835ea2',
  NURTURING: '7139207f-ccd1-4e3f-8d5b-1b97dbe2326f',
  QUALIFIED: 'ab8337aa-bcb5-4a96-bd42-d4780704984b',
  UNQUALIFIED: '38b66228-764c-48ed-a05a-84328cba2cf6',
  CONVERTED: 'e79bb0e5-154c-42b2-8fa8-9360b3787ba6',
} as const;

export const LEAD_SOURCE_OPTION_IDS = {
  WEB: '0aab0359-7731-4f96-a1c4-8c41bfd95db0',
  REFERRAL: 'd3dd695f-77b5-471a-af40-3252ac06645b',
  PARTNER: '43297b80-0d07-4d3a-9c63-251b1ee62361',
  EVENT: '936e3183-4203-4115-96de-8067200a7b7a',
  COLD_CALL: '82efcac9-5a91-4c18-9614-d3e6d952f50a',
  ADVERTISEMENT: '024d6fbe-15d2-4763-ac33-f6144dd0f1e8',
  OTHER: '54f343fe-84ce-41d5-a6ce-2595ef2c4796',
} as const;

export const LEAD_RATING_OPTION_IDS = {
  HOT: '6d963431-9853-4b6f-8348-ca6f4c600fb5',
  WARM: '7d227678-4c92-4b63-8e3c-a6bf441fb2f9',
  COLD: '905defed-195e-4e93-8de3-f5a9f02a30bd',
} as const;

export const ALL_LEADS_VIEW_UNIVERSAL_IDENTIFIER =
  'd9ad9b0c-08a1-4d60-80a3-138bedf30939';
export const ALL_LEADS_VIEW_FIELD_UNIVERSAL_IDENTIFIERS = [
  '8ba181a6-9114-4deb-af89-d2cba5fe6edd',
  '366e2cd4-3520-47b3-ba19-1f0662a63964',
  '38c2f9de-5d47-4dc3-a3c4-c6dd179cdbdb',
  '3fad93d8-2e6f-4333-8c24-546dd5603f7a',
  '6f0c46db-dff3-4615-8551-b44e5549e14a',
  '2105f108-9412-46ce-92bc-7b0bc4a79026',
  '49aad9bb-524b-42fe-9a31-627878ca574d',
  '0a055c8e-051b-40d6-9919-bd68b4b7dd99',
] as const;

export const LEAD_PIPELINE_VIEW_UNIVERSAL_IDENTIFIER =
  '24d71051-a513-4ea1-a80c-b1615ecbcf09';
export const LEAD_PIPELINE_VIEW_FIELD_UNIVERSAL_IDENTIFIERS = [
  '8d131e2a-1c6a-4f6f-bbeb-4ad045105bae',
  '9e6c0c16-0271-4978-8b27-f651205d3d20',
  '376bca22-8fe8-4e35-9eb3-5cfaaed8de2a',
  'e707c404-0142-4af9-943f-1a69d314d277',
] as const;
export const LEAD_PIPELINE_VIEW_GROUP_UNIVERSAL_IDENTIFIERS = [
  '51d99ac8-4aff-48bf-8eb3-b073fa896266',
  '037f4079-94e2-4d67-beef-121a714f54b4',
  'c307cfa9-62c4-4ac1-a0ca-7836a9557c83',
  '9d960c3f-71b1-4337-8a99-344868356dfa',
  '9f7d7178-948a-442f-8edf-e41d8452d97f',
  '718e151e-4e74-4bb7-acdf-bfb78553ef87',
] as const;

export const LEADS_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER =
  '474ebf7a-5248-4b7f-96b6-0f0ad197679e';

export const DEFAULT_FUNCTION_ROLE_UNIVERSAL_IDENTIFIER =
  '4250eb15-ce4d-48ed-804e-fd3f190183e1';

export const CONVERT_LEADS_LOGIC_FUNCTION = {
  universalIdentifier: '4b1d3908-c49b-4c9c-a175-f9286d806739',
  path: '/sales-cloud/convert-leads',
} as const;

export const ON_LEAD_STATUS_CONVERTED_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIER =
  'ebc9fca5-54f1-4a62-afed-709bd07208ba';

export const CONVERT_LEADS_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER =
  '3459ae79-6851-4e0d-b919-6c2d5a811bec';

export const CONVERT_LEADS_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIER =
  '9b25121a-8c69-44a1-b570-8ee5d3ee5586';
