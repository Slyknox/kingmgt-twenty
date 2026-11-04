import { type LeadRecord } from 'src/utils/lead-conversion-types';

const hasText = (value: string | null | undefined): value is string =>
  typeof value === 'string' && value.trim().length > 0;

export const formatLeadFullName = (lead: LeadRecord): string =>
  [lead.name?.firstName, lead.name?.lastName]
    .filter(hasText)
    .map((part) => part.trim())
    .join(' ');

// Salesforce requires a company on a lead; Twenty doesn't, so a lead with
// none converts into a company named after the person (like a person account).
export const resolveLeadCompanyName = (lead: LeadRecord): string => {
  if (hasText(lead.companyName)) {
    return lead.companyName.trim();
  }

  const fullName = formatLeadFullName(lead);

  return hasText(fullName) ? fullName : 'Unnamed company';
};

export const resolveLeadPrimaryEmail = (lead: LeadRecord): string | null => {
  const email = lead.emails?.primaryEmail;

  return hasText(email) ? email.trim().toLowerCase() : null;
};

const hasCurrency = (lead: LeadRecord) =>
  typeof lead.annualRevenue?.amountMicros === 'number' &&
  hasText(lead.annualRevenue?.currencyCode);

export const buildCompanyData = (lead: LeadRecord) => ({
  name: resolveLeadCompanyName(lead),
  ...(hasText(lead.website?.primaryLinkUrl)
    ? { domainName: { primaryLinkUrl: lead.website.primaryLinkUrl.trim() } }
    : {}),
  ...(hasCurrency(lead)
    ? {
        annualRevenue: {
          amountMicros: lead.annualRevenue!.amountMicros,
          currencyCode: lead.annualRevenue!.currencyCode,
        },
      }
    : {}),
});

export const buildPersonData = (lead: LeadRecord, companyId: string) => ({
  name: {
    firstName: lead.name?.firstName?.trim() ?? '',
    lastName: lead.name?.lastName?.trim() ?? '',
  },
  companyId,
  ...(hasText(lead.jobTitle) ? { jobTitle: lead.jobTitle.trim() } : {}),
  ...(resolveLeadPrimaryEmail(lead)
    ? {
        emails: {
          primaryEmail: resolveLeadPrimaryEmail(lead),
          additionalEmails: lead.emails?.additionalEmails ?? [],
        },
      }
    : {}),
  ...(hasText(lead.phones?.primaryPhoneNumber)
    ? {
        phones: {
          primaryPhoneNumber: lead.phones.primaryPhoneNumber,
          primaryPhoneCountryCode: lead.phones.primaryPhoneCountryCode ?? '',
          primaryPhoneCallingCode: lead.phones.primaryPhoneCallingCode ?? '',
        },
      }
    : {}),
});

// Same default name Salesforce gives the opportunity: "<company> - <person>".
export const buildOpportunityData = (
  lead: LeadRecord,
  companyId: string,
  personId: string,
) => {
  const companyName = resolveLeadCompanyName(lead);
  const fullName = formatLeadFullName(lead);

  return {
    name:
      hasText(fullName) && fullName !== companyName
        ? `${companyName} - ${fullName}`
        : companyName,
    stage: 'NEW',
    companyId,
    pointOfContactId: personId,
  };
};

// Escapes LIKE wildcards so an ilike filter is a case-insensitive exact match.
export const escapeLikePattern = (value: string): string =>
  value.replace(/[\\%_]/g, (character) => `\\${character}`);
