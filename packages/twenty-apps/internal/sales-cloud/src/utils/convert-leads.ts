import { LeadStatus } from 'src/constants/lead-options';
import {
  buildCompanyData,
  buildOpportunityData,
  buildPersonData,
  escapeLikePattern,
  resolveLeadCompanyName,
  resolveLeadPrimaryEmail,
} from 'src/utils/build-lead-conversion-plan';
import {
  type ConvertLeadsResult,
  type CrmClient,
  type LeadConversionOutcome,
  type LeadRecord,
} from 'src/utils/lead-conversion-types';

export const MAX_LEADS_PER_CONVERSION = 100;

const LEAD_SELECTION = {
  id: true,
  name: { firstName: true, lastName: true },
  companyName: true,
  jobTitle: true,
  emails: { primaryEmail: true, additionalEmails: true },
  phones: {
    primaryPhoneNumber: true,
    primaryPhoneCountryCode: true,
    primaryPhoneCallingCode: true,
  },
  website: { primaryLinkUrl: true },
  annualRevenue: { amountMicros: true, currencyCode: true },
  status: true,
  campaignId: true,
  convertedOpportunityId: true,
};

const toErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const fetchLeads = async (
  client: CrmClient,
  leadIds: string[],
): Promise<Map<string, LeadRecord>> => {
  const { leads } = await client.query({
    leads: {
      __args: { filter: { id: { in: leadIds } }, first: leadIds.length },
      edges: { node: LEAD_SELECTION },
    },
  });

  const leadById = new Map<string, LeadRecord>();

  for (const edge of leads?.edges ?? []) {
    leadById.set(edge.node.id, edge.node as LeadRecord);
  }

  return leadById;
};

const findCompanyIdByName = async (
  client: CrmClient,
  name: string,
): Promise<string | undefined> => {
  const { companies } = await client.query({
    companies: {
      __args: { filter: { name: { ilike: escapeLikePattern(name) } }, first: 1 },
      edges: { node: { id: true } },
    },
  });

  return companies?.edges?.[0]?.node?.id;
};

const findPersonIdByEmail = async (
  client: CrmClient,
  email: string,
): Promise<string | undefined> => {
  const { people } = await client.query({
    people: {
      __args: {
        filter: { emails: { primaryEmail: { ilike: escapeLikePattern(email) } } },
        first: 1,
      },
      edges: { node: { id: true } },
    },
  });

  return people?.edges?.[0]?.node?.id;
};

type CreatedRecord = { mutationName: string; id: string };

// Twenty has no multi-mutation transaction for apps, so a failed conversion
// soft-deletes whatever it created rather than leaving half a conversion.
const rollBack = async (client: CrmClient, created: CreatedRecord[]) => {
  for (const { mutationName, id } of [...created].reverse()) {
    try {
      await client.mutation({
        [mutationName]: { __args: { id }, id: true },
      });
    } catch {
      // Best effort: the original error is what the user needs to see.
    }
  }
};

const convertLead = async (
  client: CrmClient,
  lead: LeadRecord,
  now: () => Date,
): Promise<LeadConversionOutcome> => {
  if (lead.convertedOpportunityId) {
    return {
      leadId: lead.id,
      status: 'already_converted',
      opportunityId: lead.convertedOpportunityId,
    };
  }

  const created: CreatedRecord[] = [];

  try {
    let companyId = await findCompanyIdByName(
      client,
      resolveLeadCompanyName(lead),
    );
    const reusedCompany = companyId !== undefined;

    if (!companyId) {
      const { createCompany } = await client.mutation({
        createCompany: { __args: { data: buildCompanyData(lead) }, id: true },
      });
      companyId = createCompany.id as string;
      created.push({ mutationName: 'deleteCompany', id: companyId });
    }

    const primaryEmail = resolveLeadPrimaryEmail(lead);
    let personId = primaryEmail
      ? await findPersonIdByEmail(client, primaryEmail)
      : undefined;
    const reusedPerson = personId !== undefined;

    if (!personId) {
      const { createPerson } = await client.mutation({
        createPerson: {
          __args: { data: buildPersonData(lead, companyId) },
          id: true,
        },
      });
      personId = createPerson.id as string;
      created.push({ mutationName: 'deletePerson', id: personId });
    }

    const { createOpportunity } = await client.mutation({
      createOpportunity: {
        __args: { data: buildOpportunityData(lead, companyId, personId) },
        id: true,
      },
    });
    const opportunityId = createOpportunity.id as string;
    created.push({ mutationName: 'deleteOpportunity', id: opportunityId });

    await client.mutation({
      updateLead: {
        __args: {
          id: lead.id,
          data: {
            status: LeadStatus.CONVERTED,
            convertedAt: now().toISOString(),
            convertedCompanyId: companyId,
            convertedPersonId: personId,
            convertedOpportunityId: opportunityId,
            conversionError: null,
          },
        },
        id: true,
      },
    });

    return {
      leadId: lead.id,
      status: 'converted',
      companyId,
      personId,
      opportunityId,
      reusedCompany,
      reusedPerson,
    };
  } catch (error) {
    await rollBack(client, created);

    const message = toErrorMessage(error);

    // A lead dragged to "Converted" that didn't convert must not look
    // converted, so it goes back to Qualified with the reason recorded.
    try {
      await client.mutation({
        updateLead: {
          __args: {
            id: lead.id,
            data: {
              status:
                lead.status === LeadStatus.CONVERTED
                  ? LeadStatus.QUALIFIED
                  : lead.status,
              conversionError: message.slice(0, 500),
            },
          },
          id: true,
        },
      });
    } catch {
      // The outcome below still reports the failure.
    }

    return { leadId: lead.id, status: 'failed', error: message };
  }
};

export const convertLeads = async ({
  client,
  leadIds,
  now = () => new Date(),
}: {
  client: CrmClient;
  leadIds: string[];
  now?: () => Date;
}): Promise<ConvertLeadsResult> => {
  const uniqueLeadIds = [...new Set(leadIds)].slice(0, MAX_LEADS_PER_CONVERSION);

  if (uniqueLeadIds.length === 0) {
    return { total: 0, converted: 0, skipped: 0, failed: 0, results: [] };
  }

  const leadById = await fetchLeads(client, uniqueLeadIds);
  const results: LeadConversionOutcome[] = [];

  // Sequential on purpose: two leads from the same new company must find the
  // company the first one created instead of each creating a duplicate.
  for (const leadId of uniqueLeadIds) {
    const lead = leadById.get(leadId);

    results.push(
      lead
        ? await convertLead(client, lead, now)
        : { leadId, status: 'not_found' },
    );
  }

  return {
    total: results.length,
    converted: results.filter((result) => result.status === 'converted').length,
    skipped: results.filter(
      (result) =>
        result.status === 'already_converted' || result.status === 'not_found',
    ).length,
    failed: results.filter((result) => result.status === 'failed').length,
    results,
  };
};
