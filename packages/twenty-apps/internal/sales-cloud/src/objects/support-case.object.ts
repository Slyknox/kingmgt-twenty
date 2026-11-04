import { defineObject, FieldType } from 'twenty-sdk/define';

import {
  SUPPORT_CASE_FIELD_UNIVERSAL_IDENTIFIERS as F,
  SUPPORT_CASE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/support-case-identifiers';
import {
  SUPPORT_CASE_ORIGIN_OPTIONS,
  SUPPORT_CASE_PRIORITY_OPTIONS,
  SUPPORT_CASE_STATUS_OPTIONS,
  SUPPORT_CASE_TYPE_OPTIONS,
  SupportCasePriority,
  SupportCaseStatus,
} from 'src/constants/support-case-options';

// Named supportCase rather than case: CASE is an SQL keyword.
export default defineObject({
  universalIdentifier: SUPPORT_CASE_UNIVERSAL_IDENTIFIER,
  nameSingular: 'supportCase',
  namePlural: 'supportCases',
  labelSingular: 'Case',
  labelPlural: 'Cases',
  description: 'A customer question or problem, tracked to resolution against a deadline.',
  icon: 'IconLifebuoy',
  labelIdentifierFieldMetadataUniversalIdentifier: F.subject,
  fields: [
    { universalIdentifier: F.subject, type: FieldType.TEXT, name: 'subject', label: 'Subject', icon: 'IconAbc' },
    {
      universalIdentifier: F.status,
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      icon: 'IconProgress',
      defaultValue: `'${SupportCaseStatus.NEW}'`,
      options: SUPPORT_CASE_STATUS_OPTIONS,
    },
    {
      universalIdentifier: F.priority,
      type: FieldType.SELECT,
      name: 'priority',
      label: 'Priority',
      description: 'Sets the resolution deadline',
      icon: 'IconFlag',
      defaultValue: `'${SupportCasePriority.MEDIUM}'`,
      options: SUPPORT_CASE_PRIORITY_OPTIONS,
    },
    { universalIdentifier: F.origin, type: FieldType.SELECT, name: 'origin', label: 'Origin', icon: 'IconInbox', isNullable: true, options: SUPPORT_CASE_ORIGIN_OPTIONS },
    { universalIdentifier: F.caseType, type: FieldType.SELECT, name: 'caseType', label: 'Type', icon: 'IconCategory', isNullable: true, options: SUPPORT_CASE_TYPE_OPTIONS },
    { universalIdentifier: F.description, type: FieldType.TEXT, name: 'description', label: 'Description', icon: 'IconNotes', isNullable: true },
    { universalIdentifier: F.resolution, type: FieldType.TEXT, name: 'resolution', label: 'Resolution', icon: 'IconCircleCheck', isNullable: true },
    { universalIdentifier: F.firstRespondedAt, type: FieldType.DATE_TIME, name: 'firstRespondedAt', label: 'First responded at', description: 'When the case first left New. Set automatically.', icon: 'IconMessageReply', isNullable: true },
    { universalIdentifier: F.closedAt, type: FieldType.DATE_TIME, name: 'closedAt', label: 'Closed at', description: 'Set when closed, cleared when reopened.', icon: 'IconCalendarCheck', isNullable: true },
    { universalIdentifier: F.slaDueAt, type: FieldType.DATE_TIME, name: 'slaDueAt', label: 'Due by', description: 'Created time plus the priority deadline. Set automatically.', icon: 'IconAlarm', isNullable: true },
    { universalIdentifier: F.isSlaBreached, type: FieldType.BOOLEAN, name: 'isSlaBreached', label: 'Overdue', description: 'Not closed by its deadline. Checked every hour.', icon: 'IconAlertTriangle', defaultValue: false, isNullable: false },
  ],
});
