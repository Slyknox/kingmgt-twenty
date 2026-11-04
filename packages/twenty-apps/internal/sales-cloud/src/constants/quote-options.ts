import {
  PRODUCT_FAMILY_OPTION_IDS,
  QUOTE_STATUS_OPTION_IDS,
} from 'src/constants/quote-identifiers';

export enum ProductFamily {
  HARDWARE = 'HARDWARE',
  SOFTWARE = 'SOFTWARE',
  SERVICE = 'SERVICE',
  SUBSCRIPTION = 'SUBSCRIPTION',
  OTHER = 'OTHER',
}

// Salesforce's default quote statuses.
export enum QuoteStatus {
  DRAFT = 'DRAFT',
  IN_REVIEW = 'IN_REVIEW',
  PRESENTED = 'PRESENTED',
  ACCEPTED = 'ACCEPTED',
  DENIED = 'DENIED',
}

export const PRODUCT_FAMILY_OPTIONS = [
  { id: PRODUCT_FAMILY_OPTION_IDS.HARDWARE, value: ProductFamily.HARDWARE, label: 'Hardware', position: 0, color: 'orange' as const },
  { id: PRODUCT_FAMILY_OPTION_IDS.SOFTWARE, value: ProductFamily.SOFTWARE, label: 'Software', position: 1, color: 'blue' as const },
  { id: PRODUCT_FAMILY_OPTION_IDS.SERVICE, value: ProductFamily.SERVICE, label: 'Service', position: 2, color: 'green' as const },
  { id: PRODUCT_FAMILY_OPTION_IDS.SUBSCRIPTION, value: ProductFamily.SUBSCRIPTION, label: 'Subscription', position: 3, color: 'purple' as const },
  { id: PRODUCT_FAMILY_OPTION_IDS.OTHER, value: ProductFamily.OTHER, label: 'Other', position: 4, color: 'gray' as const },
];

export const QUOTE_STATUS_OPTIONS = [
  { id: QUOTE_STATUS_OPTION_IDS.DRAFT, value: QuoteStatus.DRAFT, label: 'Draft', position: 0, color: 'gray' as const },
  { id: QUOTE_STATUS_OPTION_IDS.IN_REVIEW, value: QuoteStatus.IN_REVIEW, label: 'In review', position: 1, color: 'sky' as const },
  { id: QUOTE_STATUS_OPTION_IDS.PRESENTED, value: QuoteStatus.PRESENTED, label: 'Presented', position: 2, color: 'blue' as const },
  { id: QUOTE_STATUS_OPTION_IDS.ACCEPTED, value: QuoteStatus.ACCEPTED, label: 'Accepted', position: 3, color: 'green' as const },
  { id: QUOTE_STATUS_OPTION_IDS.DENIED, value: QuoteStatus.DENIED, label: 'Denied', position: 4, color: 'red' as const },
];
