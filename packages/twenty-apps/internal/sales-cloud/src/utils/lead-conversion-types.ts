export type FullName = { firstName?: string | null; lastName?: string | null };

export type Emails = {
  primaryEmail?: string | null;
  additionalEmails?: string[] | null;
};

export type Phones = {
  primaryPhoneNumber?: string | null;
  primaryPhoneCountryCode?: string | null;
  primaryPhoneCallingCode?: string | null;
  additionalPhones?: unknown[] | null;
};

export type Links = {
  primaryLinkUrl?: string | null;
  primaryLinkLabel?: string | null;
  secondaryLinks?: unknown[] | null;
};

export type Currency = {
  amountMicros?: number | null;
  currencyCode?: string | null;
};

export type LeadRecord = {
  id: string;
  name?: FullName | null;
  companyName?: string | null;
  jobTitle?: string | null;
  emails?: Emails | null;
  phones?: Phones | null;
  website?: Links | null;
  annualRevenue?: Currency | null;
  status?: string | null;
  convertedOpportunityId?: string | null;
};

// Only what conversion needs from the generated client, so tests can stub it.
export type CrmClient = {
  query: (request: any) => Promise<any>;
  mutation: (request: any) => Promise<any>;
};

export type LeadConversionOutcome =
  | {
      leadId: string;
      status: 'converted';
      companyId: string;
      personId: string;
      opportunityId: string;
      reusedCompany: boolean;
      reusedPerson: boolean;
    }
  | { leadId: string; status: 'already_converted'; opportunityId: string }
  | { leadId: string; status: 'not_found' }
  | { leadId: string; status: 'failed'; error: string };

export type ConvertLeadsResult = {
  total: number;
  converted: number;
  skipped: number;
  failed: number;
  results: LeadConversionOutcome[];
};
