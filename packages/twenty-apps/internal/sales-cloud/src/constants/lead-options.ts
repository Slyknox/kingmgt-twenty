import {
  LEAD_RATING_OPTION_IDS,
  LEAD_SOURCE_OPTION_IDS,
  LEAD_STATUS_OPTION_IDS,
} from 'src/constants/universal-identifiers';

// Mirrors Salesforce's default Lead Status picklist, plus Nurturing.
export enum LeadStatus {
  NEW = 'NEW',
  WORKING = 'WORKING',
  NURTURING = 'NURTURING',
  QUALIFIED = 'QUALIFIED',
  UNQUALIFIED = 'UNQUALIFIED',
  CONVERTED = 'CONVERTED',
}

export enum LeadSource {
  WEB = 'WEB',
  REFERRAL = 'REFERRAL',
  PARTNER = 'PARTNER',
  EVENT = 'EVENT',
  COLD_CALL = 'COLD_CALL',
  ADVERTISEMENT = 'ADVERTISEMENT',
  OTHER = 'OTHER',
}

export enum LeadRating {
  HOT = 'HOT',
  WARM = 'WARM',
  COLD = 'COLD',
}

export const LEAD_STATUS_OPTIONS = [
  { id: LEAD_STATUS_OPTION_IDS.NEW, value: LeadStatus.NEW, label: 'New', position: 0, color: 'sky' as const },
  { id: LEAD_STATUS_OPTION_IDS.WORKING, value: LeadStatus.WORKING, label: 'Working', position: 1, color: 'blue' as const },
  { id: LEAD_STATUS_OPTION_IDS.NURTURING, value: LeadStatus.NURTURING, label: 'Nurturing', position: 2, color: 'purple' as const },
  { id: LEAD_STATUS_OPTION_IDS.QUALIFIED, value: LeadStatus.QUALIFIED, label: 'Qualified', position: 3, color: 'turquoise' as const },
  { id: LEAD_STATUS_OPTION_IDS.UNQUALIFIED, value: LeadStatus.UNQUALIFIED, label: 'Unqualified', position: 4, color: 'gray' as const },
  { id: LEAD_STATUS_OPTION_IDS.CONVERTED, value: LeadStatus.CONVERTED, label: 'Converted', position: 5, color: 'green' as const },
];

export const LEAD_SOURCE_OPTIONS = [
  { id: LEAD_SOURCE_OPTION_IDS.WEB, value: LeadSource.WEB, label: 'Web', position: 0, color: 'blue' as const },
  { id: LEAD_SOURCE_OPTION_IDS.REFERRAL, value: LeadSource.REFERRAL, label: 'Referral', position: 1, color: 'green' as const },
  { id: LEAD_SOURCE_OPTION_IDS.PARTNER, value: LeadSource.PARTNER, label: 'Partner', position: 2, color: 'purple' as const },
  { id: LEAD_SOURCE_OPTION_IDS.EVENT, value: LeadSource.EVENT, label: 'Event', position: 3, color: 'orange' as const },
  { id: LEAD_SOURCE_OPTION_IDS.COLD_CALL, value: LeadSource.COLD_CALL, label: 'Cold call', position: 4, color: 'sky' as const },
  { id: LEAD_SOURCE_OPTION_IDS.ADVERTISEMENT, value: LeadSource.ADVERTISEMENT, label: 'Advertisement', position: 5, color: 'pink' as const },
  { id: LEAD_SOURCE_OPTION_IDS.OTHER, value: LeadSource.OTHER, label: 'Other', position: 6, color: 'gray' as const },
];

export const LEAD_RATING_OPTIONS = [
  { id: LEAD_RATING_OPTION_IDS.HOT, value: LeadRating.HOT, label: 'Hot', position: 0, color: 'red' as const },
  { id: LEAD_RATING_OPTION_IDS.WARM, value: LeadRating.WARM, label: 'Warm', position: 1, color: 'orange' as const },
  { id: LEAD_RATING_OPTION_IDS.COLD, value: LeadRating.COLD, label: 'Cold', position: 2, color: 'blue' as const },
];
