// Universal identifiers are permanent: once installed in a workspace they key
// the metadata, so never regenerate or reuse one.

export const CAMPAIGN_UNIVERSAL_IDENTIFIER = 'bdcfa18f-86e3-4c1d-81ca-9c93c6598b7f';

export const CAMPAIGN_FIELD_UNIVERSAL_IDENTIFIERS = {
  name: 'f80947b1-209f-44ce-83a6-97c6f4c9a1e7',
  campaignType: '265e2edb-0f5d-4774-9806-b71f5400e254',
  status: '807740b2-8d32-42d8-91c3-fb60c35bb55e',
  startDate: '7ff527f7-d3c0-4c62-b53e-845dd899e479',
  endDate: 'b4ac501c-bdc5-4dd2-b9d6-248188e58275',
  budgetedCost: '846efcdd-13ea-4743-8f56-d1a5fc0e8f7c',
  actualCost: 'c5619ee4-886f-4eca-843e-e2ae286c7d2c',
  expectedRevenue: 'b4971e50-7f13-4b31-a7d9-9f500fae02d7',
  description: '02a96f17-edf5-417f-bb9e-ac0cdf9c61bb',
  leadCount: '48d645a1-7c3a-412e-ac49-372a7af4b92a',
  convertedLeadCount: '9ab52a33-c023-41c9-aa04-c64d6ecbff76',
  opportunityCount: 'cbb017c8-7ef1-496b-a0ca-e21e6b65b38c',
  wonOpportunityCount: '13bd5919-1fe1-4c7c-b193-f429a5264a3d',
  pipelineAmount: '895da72b-ec4a-4214-8b53-ace68a83b09b',
  wonAmount: '8f6153a8-6dfe-4842-bfff-00a42dead5ff',
  roiPercent: '287c584f-0bef-4d6c-bf34-b6f0cc465703',
  otherCurrencyOpportunityCount: '5dfc716b-2844-41dd-a82f-f6bd10f76c34',
  memberCount: '2ef2cdbd-a117-4697-a3b9-d697e268010d',
  respondedMemberCount: 'bb7ccf18-ad88-419a-ba0c-eeb48a6a7def',
  rollupsUpdatedAt: 'bef68a8c-f974-4396-9f9e-dd070ce4c63c',
} as const;

export const CAMPAIGN_RELATION_UNIVERSAL_IDENTIFIERS = {
  campaignOnLead: '0b60706f-f218-4485-bb5c-f0743bbba9b0',
  leadsOnCampaign: '52573a4e-d359-4576-8e59-2cc19f519281',
  campaignOnOpportunity: '81c5f13f-2994-4ade-ab41-1349bc3a71e4',
  opportunitiesOnCampaign: '5afa814a-1deb-439b-a544-49ab578eda9e',
} as const;

export const CAMPAIGN_TYPE_OPTION_IDS = {
  EMAIL: 'e1f30ea2-aa32-4087-b06c-e366eb18d010',
  WEBINAR: 'e695779d-6921-4809-bc1e-2d557731b0bc',
  CONFERENCE: 'f7bd1354-8790-477e-bc08-dad16dacdf9a',
  ADVERTISEMENT: '3e314a74-acc6-4b94-96c7-8f35ac5724a9',
  DIRECT_MAIL: 'e1624eeb-8896-4b8f-934a-d01f259a2dfb',
  PARTNER: 'a2ca530f-67b3-44e0-8dfb-5537a93cc72c',
  SOCIAL: 'ac6d7f54-91b9-4f3c-bada-d77dcff76989',
  OTHER: 'b3e3b9ce-4aa8-4d1d-938f-b3fc307d6dbf',
} as const;

export const CAMPAIGN_STATUS_OPTION_IDS = {
  PLANNED: 'c3fa3def-aede-4f9e-9765-5c3fc457a88c',
  IN_PROGRESS: '1482fb8b-c993-4a4f-964c-80dc548722fc',
  COMPLETED: 'd01bdfb4-2b21-4c92-b61d-1ac1fe78db42',
  ABORTED: '9942df78-ba30-4ed0-83d6-edb5142ed6dc',
} as const;

export const FORECAST_FIELD_UNIVERSAL_IDENTIFIERS = {
  forecastCategory: '69887dca-271a-4f48-ac97-8408f5ce0d9e',
  probability: 'b727b539-686b-401a-83de-bb0deb8328dc',
  expectedRevenue: '382a1d30-359d-489e-9e28-d33a4258d811',
} as const;

export const FORECAST_CATEGORY_OPTION_IDS = {
  PIPELINE: 'd76b6505-17d0-4006-a4ba-b3eeeb005584',
  BEST_CASE: '1c32cd82-16b9-4ec1-8654-008bdff33779',
  COMMIT: '7190b3bb-8bec-4449-bb46-0b374c438b1f',
  CLOSED: 'a2589feb-487a-42c8-a3ea-39ed3b1a942d',
  OMITTED: '22664052-e63f-4af7-8ae3-d98594e80749',
} as const;

export const ALL_CAMPAIGNS_VIEW_UNIVERSAL_IDENTIFIER = 'f61b85c1-ee39-4daf-8485-aff8ea8fabff';
export const ALL_CAMPAIGNS_VIEW_FIELD_UNIVERSAL_IDENTIFIERS = [
  '08ec1371-ef08-48de-8366-64cbd1ada245',
  '5393e52f-bad2-4c52-847a-48d2e9bb2e1e',
  'a5ac9df7-4379-4b16-b489-88c3214a7be1',
  '9d5197db-dced-4ef4-a938-5fcc96139d82',
  'ae9f2874-eb42-4970-bb94-78ad47cbac19',
  '03605e9b-90cb-4b92-bc78-223637991fb9',
  '0c3eee76-598a-4230-b36c-b2011fe34b01',
  '8b4d2aff-2b4b-4991-94a4-b1075f62ff81',
  '036029a2-fa72-4080-83f5-f2f7a0c617c3',
  'f298b02a-e4dd-4f4d-a6b0-7fb860bb972c',
] as const;

export const FORECAST_PIPELINE_VIEW_UNIVERSAL_IDENTIFIER = '958d75f3-4874-4c7c-98bc-d38454908514';
export const FORECAST_PIPELINE_VIEW_FIELD_UNIVERSAL_IDENTIFIERS = [
  '259f3650-90a8-4a4e-b6c3-a21e22d93c04',
  '5684d606-614a-47c9-b647-bc45e9f65f9b',
  'd5e6239f-f284-493b-9140-a3ea39e993df',
  '1fee19b6-aea5-4513-bff0-3913cc8c993c',
  'f834a81d-d2b1-4f62-aa24-a9c854ead698',
  '3658735d-c0de-4931-b46f-d75f1c1fc93f',
] as const;

export const FORECAST_PIPELINE_VIEW_GROUP_UNIVERSAL_IDENTIFIERS = [
  '380c4b7e-2f9b-42ac-b521-5ffff35a9c89',
  '225e11d5-562d-4842-a8e1-c78150b8dad6',
  'a2bbcd06-7fae-4435-86f0-1c687dd13577',
  '8a2df876-8964-4b6b-9498-f7c6f22066d7',
  'eac962fd-b71b-4641-b5bd-4ddd344185a4',
] as const;

export const CAMPAIGNS_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER = '653a8846-f2ac-4807-81df-f2afeb05e628';
export const FORECAST_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER = '02d902ff-3d61-4279-a335-8ce87fff8ae6';

export const FORECAST_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER = 'b2375646-fb23-4f6d-ba3a-c5dcb752ec3a';
export const FORECAST_DASHBOARD_TAB_UNIVERSAL_IDENTIFIER = '2641045f-0dc2-41fb-995c-dfd6c11cd651';
export const FORECAST_DASHBOARD_WIDGET_UNIVERSAL_IDENTIFIERS = {
  openPipeline: '182c1f47-60f6-4d10-8375-ed86402b54c9',
  weightedPipeline: '86498a87-3a04-4937-839a-de2110b2799b',
  commit: '771fd0e5-9947-422b-b0d7-ebb757b0ced0',
  closedWon: '7e3fcb27-1c3c-4246-9e1d-8e41055a5378',
  weightedByMonth: 'e378c3db-1124-467e-8c4f-3ef3c61c6bb0',
  pipelineByCategory: 'b1482637-afd6-429f-915f-212859918f5a',
  campaignWonByType: 'ac1a921e-db45-4b35-aa21-38b2ad753a07',
  campaignPipelineByType: '50d7ef5c-2ae1-4518-bbab-e22d3ad15d5c',
} as const;

export const CAMPAIGN_FORECAST_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIERS = {
  onOpportunityForecastInputsChanged: '363d12d6-6e2f-4ffe-a0a5-193c5f0c42cc',
  onOpportunityCampaignInputsChanged: '4a257f83-839d-4a37-9e88-5b84b8db9b61',
  onLeadCampaignInputsChanged: '19fa9006-6f01-4639-b1ab-82b2fb34a8e0',
  onCampaignCostChanged: '6bc02fa5-3091-41d0-8950-fae3f3883e86',
  nightlyRecompute: '17d9a34b-e446-4108-bc1e-fe65a36a8c2b',
  postInstall: '5397fa59-9a78-4dcd-83c6-3deb77960ddf',
} as const;

export const CAMPAIGN_MEMBER_UNIVERSAL_IDENTIFIER = '9c98d3ad-0b22-4e28-9616-f8106c6bcd8c';

export const CAMPAIGN_MEMBER_FIELD_UNIVERSAL_IDENTIFIERS = {
  name: 'd81e855b-35ce-4c6a-b735-a217908038d3',
  memberStatus: '5eae76f9-07fd-4465-b521-667647e73137',
  respondedAt: 'da634f64-632f-470d-8190-db9e9e7142e6',
} as const;

export const CAMPAIGN_MEMBER_STATUS_OPTION_IDS = {
  SENT: '1b2920e0-16f1-49b8-bbba-79990b161448',
  RESPONDED: 'b20d8139-fa1d-416b-909e-c2979d787f71',
} as const;

export const CAMPAIGN_MEMBER_RELATION_UNIVERSAL_IDENTIFIERS = {
  campaignOnMember: '2c3c43d3-9864-4ab7-9c24-96bcb55f2131',
  membersOnCampaign: 'e4fb506a-b473-4bbe-8c74-b949ab326dda',
  leadOnMember: 'e0e027a2-5f90-458f-928b-10e13497950c',
  campaignMembershipsOnLead: '26ccb41f-f2fb-41be-9853-b13de27da7b1',
  personOnMember: 'dee12542-1cdf-45e4-8015-97e2a0201767',
  campaignMembershipsOnPerson: '44e62244-371e-4663-b8a1-a302357b492c',
} as const;

export const ALL_CAMPAIGN_MEMBERS_VIEW_UNIVERSAL_IDENTIFIER = 'baf4fffe-8079-4391-833c-2f5070ac1d78';
export const ALL_CAMPAIGN_MEMBERS_VIEW_FIELD_UNIVERSAL_IDENTIFIERS = [
  '3525bc37-d959-4bf3-89a4-9d34fa4c5739',
  '415d1feb-e956-4003-a456-59ed15613bfb',
  '69e7226c-2f4d-4ed7-8609-e78e19689919',
  'a8c072fa-6d68-4238-a4f6-d01c93dc9a22',
  '6b7e311a-8f37-4476-85e9-ecdb93c54b8e',
  '9ec49f9d-692f-4369-a254-2e4d51211f55',
] as const;

export const ON_CAMPAIGN_MEMBER_CHANGED_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIER = '2763f253-06ea-4878-a93f-47297f1febab';
export const CAMPAIGN_MEMBERS_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIER = 'a90e97b7-0405-4047-92be-f684e04c5885';
