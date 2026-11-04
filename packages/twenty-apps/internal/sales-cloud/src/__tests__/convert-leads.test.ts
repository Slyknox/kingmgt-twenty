import { describe, expect, it } from 'vitest';

import { createFakeCrmClient } from 'src/__tests__/fake-crm-client';
import { convertLeads } from 'src/utils/convert-leads';

const NOW = () => new Date('2026-11-04T12:00:00.000Z');

const ada = {
  id: 'lead-ada',
  name: { firstName: 'Ada', lastName: 'Lovelace' },
  companyName: 'Analytical Engines',
  jobTitle: 'CTO',
  emails: { primaryEmail: 'Ada@Engines.io', additionalEmails: [] },
  phones: { primaryPhoneNumber: '5550100', primaryPhoneCountryCode: 'US', primaryPhoneCallingCode: '+1' },
  website: { primaryLinkUrl: 'engines.io' },
  annualRevenue: { amountMicros: 5_000_000_000_000, currencyCode: 'USD' },
  status: 'QUALIFIED',
};

describe('convertLeads', () => {
  it('creates a company, person and opportunity and links them on the lead', async () => {
    const { client, tables } = createFakeCrmClient({ lead: [{ ...ada }] });

    const result = await convertLeads({ client, leadIds: ['lead-ada'], now: NOW });

    expect(result).toMatchObject({ total: 1, converted: 1, failed: 0 });
    const [company] = tables.company;
    const [person] = tables.person;
    const [opportunity] = tables.opportunity;
    expect(company).toMatchObject({
      name: 'Analytical Engines',
      domainName: { primaryLinkUrl: 'engines.io' },
      annualRevenue: { amountMicros: 5_000_000_000_000, currencyCode: 'USD' },
    });
    expect(person).toMatchObject({
      name: { firstName: 'Ada', lastName: 'Lovelace' },
      jobTitle: 'CTO',
      companyId: company.id,
      emails: { primaryEmail: 'ada@engines.io' },
    });
    expect(opportunity).toMatchObject({
      name: 'Analytical Engines - Ada Lovelace',
      stage: 'NEW',
      companyId: company.id,
      pointOfContactId: person.id,
    });
    expect(tables.lead[0]).toMatchObject({
      status: 'CONVERTED',
      convertedAt: '2026-11-04T12:00:00.000Z',
      convertedCompanyId: company.id,
      convertedPersonId: person.id,
      convertedOpportunityId: opportunity.id,
      conversionError: null,
    });
  });

  it('reuses a company with the same name and a person with the same email', async () => {
    const { client, tables } = createFakeCrmClient({
      lead: [{ ...ada }],
      company: [{ id: 'company-existing', name: 'analytical engines' }],
      person: [{ id: 'person-existing', emails: { primaryEmail: 'ada@engines.io' } }],
    });

    const [outcome] = (await convertLeads({ client, leadIds: ['lead-ada'], now: NOW })).results;

    expect(outcome).toMatchObject({
      status: 'converted',
      companyId: 'company-existing',
      personId: 'person-existing',
      reusedCompany: true,
      reusedPerson: true,
    });
    expect(tables.company).toHaveLength(1);
    expect(tables.person).toHaveLength(1);
    expect(tables.opportunity).toHaveLength(1);
  });

  it('does not treat LIKE wildcards in a company name as a match', async () => {
    const { client, tables } = createFakeCrmClient({
      lead: [{ ...ada, companyName: '100% Growth' }],
      company: [{ id: 'company-other', name: '100X Growth' }],
    });

    await convertLeads({ client, leadIds: ['lead-ada'], now: NOW });

    expect(tables.company.map((company) => company.name)).toEqual(['100X Growth', '100% Growth']);
  });

  it('makes two leads from one new company share a single company', async () => {
    const { client, tables } = createFakeCrmClient({
      lead: [
        { ...ada },
        { ...ada, id: 'lead-charles', name: { firstName: 'Charles', lastName: 'Babbage' }, emails: { primaryEmail: 'charles@engines.io' } },
      ],
    });

    const result = await convertLeads({ client, leadIds: ['lead-ada', 'lead-charles'], now: NOW });

    expect(result.converted).toBe(2);
    expect(tables.company).toHaveLength(1);
    expect(tables.person).toHaveLength(2);
    expect(tables.opportunity).toHaveLength(2);
  });

  it('names the company after the person when the lead has no company', async () => {
    const { client, tables } = createFakeCrmClient({
      lead: [{ ...ada, companyName: '  ' }],
    });

    await convertLeads({ client, leadIds: ['lead-ada'], now: NOW });

    expect(tables.company[0].name).toBe('Ada Lovelace');
    expect(tables.opportunity[0].name).toBe('Ada Lovelace');
  });

  it('skips a lead that is already converted and one that does not exist', async () => {
    const { client, tables } = createFakeCrmClient({
      lead: [{ ...ada, status: 'CONVERTED', convertedOpportunityId: 'opportunity-old' }],
    });

    const result = await convertLeads({ client, leadIds: ['lead-ada', 'lead-ada', 'lead-missing'], now: NOW });

    expect(result).toMatchObject({ total: 2, converted: 0, skipped: 2, failed: 0 });
    expect(result.results).toEqual([
      { leadId: 'lead-ada', status: 'already_converted', opportunityId: 'opportunity-old' },
      { leadId: 'lead-missing', status: 'not_found' },
    ]);
    expect(tables.company).toHaveLength(0);
  });

  it('undoes what it created and puts a dragged lead back to Qualified when a step fails', async () => {
    const { client, tables, deleted, failOn } = createFakeCrmClient({
      lead: [{ ...ada, status: 'CONVERTED' }],
    });
    failOn.add('createOpportunity');

    const result = await convertLeads({ client, leadIds: ['lead-ada'], now: NOW });

    expect(result.results[0]).toEqual({
      leadId: 'lead-ada',
      status: 'failed',
      error: 'createOpportunity rejected',
    });
    expect(deleted.map(({ object }) => object)).toEqual(['Person', 'Company']);
    expect(tables.lead[0]).toMatchObject({
      status: 'QUALIFIED',
      conversionError: 'createOpportunity rejected',
    });
    expect(tables.lead[0].convertedOpportunityId).toBeUndefined();
  });

  it('never deletes a reused company when a later step fails', async () => {
    const { client, deleted, failOn } = createFakeCrmClient({
      lead: [{ ...ada }],
      company: [{ id: 'company-existing', name: 'Analytical Engines' }],
    });
    failOn.add('createOpportunity');

    await convertLeads({ client, leadIds: ['lead-ada'], now: NOW });

    expect(deleted).toEqual([{ object: 'Person', id: expect.any(String) }]);
  });

  it('does nothing for an empty selection', async () => {
    const { client } = createFakeCrmClient({});

    expect(await convertLeads({ client, leadIds: [] })).toEqual({
      total: 0, converted: 0, skipped: 0, failed: 0, results: [],
    });
  });
});
