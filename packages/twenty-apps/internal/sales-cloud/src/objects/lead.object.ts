import { defineObject, FieldType } from 'twenty-sdk/define';

import {
  LEAD_RATING_OPTIONS,
  LEAD_SOURCE_OPTIONS,
  LEAD_STATUS_OPTIONS,
  LeadStatus,
} from 'src/constants/lead-options';
import {
  LEAD_FIELD_UNIVERSAL_IDENTIFIERS as F,
  LEAD_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineObject({
  universalIdentifier: LEAD_UNIVERSAL_IDENTIFIER,
  nameSingular: 'lead',
  namePlural: 'leads',
  labelSingular: 'Lead',
  labelPlural: 'Leads',
  description:
    'A prospect not yet qualified. Converting it creates a company, person and opportunity.',
  icon: 'IconTargetArrow',
  labelIdentifierFieldMetadataUniversalIdentifier: F.name,
  fields: [
    { universalIdentifier: F.name, type: FieldType.FULL_NAME, name: 'name', label: 'Name', icon: 'IconUser' },
    { universalIdentifier: F.companyName, type: FieldType.TEXT, name: 'companyName', label: 'Company', description: 'Becomes (or matches) the company on conversion', icon: 'IconBuildingSkyscraper', isNullable: true },
    { universalIdentifier: F.jobTitle, type: FieldType.TEXT, name: 'jobTitle', label: 'Job title', icon: 'IconBriefcase', isNullable: true },
    { universalIdentifier: F.emails, type: FieldType.EMAILS, name: 'emails', label: 'Emails', icon: 'IconMail', isNullable: true },
    { universalIdentifier: F.phones, type: FieldType.PHONES, name: 'phones', label: 'Phones', icon: 'IconPhone', isNullable: true },
    { universalIdentifier: F.website, type: FieldType.LINKS, name: 'website', label: 'Website', icon: 'IconWorld', isNullable: true },
    {
      universalIdentifier: F.status,
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      description: 'Moving a lead to Converted runs the conversion',
      icon: 'IconProgress',
      defaultValue: `'${LeadStatus.NEW}'`,
      options: LEAD_STATUS_OPTIONS,
    },
    { universalIdentifier: F.source, type: FieldType.SELECT, name: 'source', label: 'Lead source', icon: 'IconAntenna', isNullable: true, options: LEAD_SOURCE_OPTIONS },
    { universalIdentifier: F.rating, type: FieldType.SELECT, name: 'rating', label: 'Rating', icon: 'IconFlame', isNullable: true, options: LEAD_RATING_OPTIONS },
    { universalIdentifier: F.annualRevenue, type: FieldType.CURRENCY, name: 'annualRevenue', label: 'Annual revenue', icon: 'IconMoneybag', isNullable: true },
    { universalIdentifier: F.employees, type: FieldType.NUMBER, name: 'employees', label: 'Employees', icon: 'IconUsers', isNullable: true },
    { universalIdentifier: F.description, type: FieldType.TEXT, name: 'description', label: 'Description', icon: 'IconNotes', isNullable: true },
    { universalIdentifier: F.convertedAt, type: FieldType.DATE_TIME, name: 'convertedAt', label: 'Converted at', icon: 'IconCalendarCheck', isNullable: true },
    { universalIdentifier: F.conversionError, type: FieldType.TEXT, name: 'conversionError', label: 'Conversion error', description: 'Why the last conversion attempt failed, if it did', icon: 'IconAlertTriangle', isNullable: true },
  ],
});
