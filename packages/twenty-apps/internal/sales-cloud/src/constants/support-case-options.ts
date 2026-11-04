import {
  SUPPORT_CASE_ORIGIN_OPTION_IDS,
  SUPPORT_CASE_PRIORITY_OPTION_IDS,
  SUPPORT_CASE_STATUS_OPTION_IDS,
  SUPPORT_CASE_TYPE_OPTION_IDS,
} from 'src/constants/support-case-identifiers';

export enum SupportCaseStatus {
  NEW = 'NEW',
  WORKING = 'WORKING',
  ESCALATED = 'ESCALATED',
  ON_HOLD = 'ON_HOLD',
  CLOSED = 'CLOSED',
}

export enum SupportCasePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export const OPEN_SUPPORT_CASE_STATUSES = [
  SupportCaseStatus.NEW,
  SupportCaseStatus.WORKING,
  SupportCaseStatus.ESCALATED,
  SupportCaseStatus.ON_HOLD,
];

// Hours from creation to the resolution deadline, by priority. Change these
// to match your support policy.
export const SLA_HOURS_BY_PRIORITY: Record<SupportCasePriority, number> = {
  [SupportCasePriority.CRITICAL]: 4,
  [SupportCasePriority.HIGH]: 8,
  [SupportCasePriority.MEDIUM]: 24,
  [SupportCasePriority.LOW]: 72,
};

export const SUPPORT_CASE_STATUS_OPTIONS = [
  { id: SUPPORT_CASE_STATUS_OPTION_IDS.NEW, value: SupportCaseStatus.NEW, label: 'New', position: 0, color: 'sky' as const },
  { id: SUPPORT_CASE_STATUS_OPTION_IDS.WORKING, value: SupportCaseStatus.WORKING, label: 'Working', position: 1, color: 'blue' as const },
  { id: SUPPORT_CASE_STATUS_OPTION_IDS.ESCALATED, value: SupportCaseStatus.ESCALATED, label: 'Escalated', position: 2, color: 'red' as const },
  { id: SUPPORT_CASE_STATUS_OPTION_IDS.ON_HOLD, value: SupportCaseStatus.ON_HOLD, label: 'On hold', position: 3, color: 'orange' as const },
  { id: SUPPORT_CASE_STATUS_OPTION_IDS.CLOSED, value: SupportCaseStatus.CLOSED, label: 'Closed', position: 4, color: 'green' as const },
];

export const SUPPORT_CASE_PRIORITY_OPTIONS = [
  { id: SUPPORT_CASE_PRIORITY_OPTION_IDS.LOW, value: SupportCasePriority.LOW, label: 'Low', position: 0, color: 'gray' as const },
  { id: SUPPORT_CASE_PRIORITY_OPTION_IDS.MEDIUM, value: SupportCasePriority.MEDIUM, label: 'Medium', position: 1, color: 'blue' as const },
  { id: SUPPORT_CASE_PRIORITY_OPTION_IDS.HIGH, value: SupportCasePriority.HIGH, label: 'High', position: 2, color: 'orange' as const },
  { id: SUPPORT_CASE_PRIORITY_OPTION_IDS.CRITICAL, value: SupportCasePriority.CRITICAL, label: 'Critical', position: 3, color: 'red' as const },
];

export const SUPPORT_CASE_ORIGIN_OPTIONS = [
  { id: SUPPORT_CASE_ORIGIN_OPTION_IDS.EMAIL, value: 'EMAIL', label: 'Email', position: 0, color: 'blue' as const },
  { id: SUPPORT_CASE_ORIGIN_OPTION_IDS.PHONE, value: 'PHONE', label: 'Phone', position: 1, color: 'green' as const },
  { id: SUPPORT_CASE_ORIGIN_OPTION_IDS.WEB, value: 'WEB', label: 'Web', position: 2, color: 'sky' as const },
  { id: SUPPORT_CASE_ORIGIN_OPTION_IDS.CHAT, value: 'CHAT', label: 'Chat', position: 3, color: 'purple' as const },
  { id: SUPPORT_CASE_ORIGIN_OPTION_IDS.OTHER, value: 'OTHER', label: 'Other', position: 4, color: 'gray' as const },
];

export const SUPPORT_CASE_TYPE_OPTIONS = [
  { id: SUPPORT_CASE_TYPE_OPTION_IDS.QUESTION, value: 'QUESTION', label: 'Question', position: 0, color: 'sky' as const },
  { id: SUPPORT_CASE_TYPE_OPTION_IDS.PROBLEM, value: 'PROBLEM', label: 'Problem', position: 1, color: 'red' as const },
  { id: SUPPORT_CASE_TYPE_OPTION_IDS.FEATURE_REQUEST, value: 'FEATURE_REQUEST', label: 'Feature request', position: 2, color: 'purple' as const },
  { id: SUPPORT_CASE_TYPE_OPTION_IDS.OTHER, value: 'OTHER', label: 'Other', position: 3, color: 'gray' as const },
];
