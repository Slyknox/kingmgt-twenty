import {
  CAMPAIGN_STATUS_OPTION_IDS,
  CAMPAIGN_TYPE_OPTION_IDS,
} from 'src/constants/campaign-forecast-identifiers';

export enum CampaignType {
  EMAIL = 'EMAIL',
  WEBINAR = 'WEBINAR',
  CONFERENCE = 'CONFERENCE',
  ADVERTISEMENT = 'ADVERTISEMENT',
  DIRECT_MAIL = 'DIRECT_MAIL',
  PARTNER = 'PARTNER',
  SOCIAL = 'SOCIAL',
  OTHER = 'OTHER',
}

export enum CampaignStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ABORTED = 'ABORTED',
}

export const CAMPAIGN_TYPE_OPTIONS = [
  { id: CAMPAIGN_TYPE_OPTION_IDS.EMAIL, value: CampaignType.EMAIL, label: 'Email', position: 0, color: 'blue' as const },
  { id: CAMPAIGN_TYPE_OPTION_IDS.WEBINAR, value: CampaignType.WEBINAR, label: 'Webinar', position: 1, color: 'purple' as const },
  { id: CAMPAIGN_TYPE_OPTION_IDS.CONFERENCE, value: CampaignType.CONFERENCE, label: 'Conference', position: 2, color: 'orange' as const },
  { id: CAMPAIGN_TYPE_OPTION_IDS.ADVERTISEMENT, value: CampaignType.ADVERTISEMENT, label: 'Advertisement', position: 3, color: 'pink' as const },
  { id: CAMPAIGN_TYPE_OPTION_IDS.DIRECT_MAIL, value: CampaignType.DIRECT_MAIL, label: 'Direct mail', position: 4, color: 'turquoise' as const },
  { id: CAMPAIGN_TYPE_OPTION_IDS.PARTNER, value: CampaignType.PARTNER, label: 'Partner', position: 5, color: 'green' as const },
  { id: CAMPAIGN_TYPE_OPTION_IDS.SOCIAL, value: CampaignType.SOCIAL, label: 'Social', position: 6, color: 'sky' as const },
  { id: CAMPAIGN_TYPE_OPTION_IDS.OTHER, value: CampaignType.OTHER, label: 'Other', position: 7, color: 'gray' as const },
];

export const CAMPAIGN_STATUS_OPTIONS = [
  { id: CAMPAIGN_STATUS_OPTION_IDS.PLANNED, value: CampaignStatus.PLANNED, label: 'Planned', position: 0, color: 'sky' as const },
  { id: CAMPAIGN_STATUS_OPTION_IDS.IN_PROGRESS, value: CampaignStatus.IN_PROGRESS, label: 'In progress', position: 1, color: 'blue' as const },
  { id: CAMPAIGN_STATUS_OPTION_IDS.COMPLETED, value: CampaignStatus.COMPLETED, label: 'Completed', position: 2, color: 'green' as const },
  { id: CAMPAIGN_STATUS_OPTION_IDS.ABORTED, value: CampaignStatus.ABORTED, label: 'Aborted', position: 3, color: 'gray' as const },
];
