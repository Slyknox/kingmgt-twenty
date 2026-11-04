import { describe, expect, it } from 'vitest';

import { createFakeCrmClient } from 'src/__tests__/fake-crm-client';
import {
  applyOpportunityForecasts,
  backfillOpportunityForecasts,
} from 'src/utils/apply-opportunity-forecasts';
import {
  collectForecastChanges,
  computeForecastPatch,
} from 'src/utils/compute-opportunity-forecast';

const usd = (dollars: number) => ({ amountMicros: dollars * 1_000_000, currencyCode: 'USD' });
const CREATED = { stageChanged: true, probabilitySetByUser: false, forecastCategorySetByUser: false };
const NOTHING = { stageChanged: false, probabilitySetByUser: false, forecastCategorySetByUser: false };

describe('computeForecastPatch', () => {
  it("gives a new opportunity its stage's probability, category and expected revenue", () => {
    expect(computeForecastPatch({ id: 'o', stage: 'PROPOSAL', amount: usd(100_000) }, CREATED)).toEqual({
      probability: 70,
      forecastCategory: 'COMMIT',
      expectedRevenue: usd(70_000),
    });
  });

  it('resets probability on a stage change but keeps one set in the same edit', () => {
    const opportunity = { id: 'o', stage: 'MEETING', amount: usd(1000), probability: 55, forecastCategory: 'COMMIT' };

    expect(computeForecastPatch(opportunity, { ...NOTHING, stageChanged: true })).toMatchObject({
      probability: 40,
      forecastCategory: 'BEST_CASE',
      expectedRevenue: usd(400),
    });
    expect(
      computeForecastPatch(opportunity, { stageChanged: true, probabilitySetByUser: true, forecastCategorySetByUser: true }),
    ).toEqual({ expectedRevenue: usd(550) });
  });

  it('leaves probability and category alone for a custom stage', () => {
    expect(
      computeForecastPatch({ id: 'o', stage: 'LEGAL_REVIEW', amount: usd(200), probability: 50, forecastCategory: 'COMMIT' }, CREATED),
    ).toEqual({ expectedRevenue: usd(100) });
  });

  it('clamps a probability outside 0 to 100', () => {
    expect(computeForecastPatch({ id: 'o', stage: 'X', amount: usd(10), probability: 150 }, NOTHING)).toEqual({
      probability: 100,
      expectedRevenue: usd(10),
    });
  });

  it('empties expected revenue when the amount is cleared', () => {
    expect(
      computeForecastPatch({ id: 'o', stage: 'NEW', amount: { amountMicros: null, currencyCode: 'EUR' }, probability: 10, forecastCategory: 'PIPELINE', expectedRevenue: usd(5) }, NOTHING),
    ).toEqual({ expectedRevenue: { amountMicros: null, currencyCode: 'EUR' } });
  });

  it('has nothing to write when run on its own output, so the trigger cannot loop', () => {
    const opportunity = { id: 'o', stage: 'PROPOSAL', amount: usd(100_000) };
    const patch = computeForecastPatch(opportunity, CREATED)!;
    const ownWrite = { stageChanged: false, probabilitySetByUser: true, forecastCategorySetByUser: true };

    expect(computeForecastPatch({ ...opportunity, ...patch }, ownWrite)).toBeNull();
  });
});

describe('collectForecastChanges', () => {
  it('reads updated fields per record and ignores deletes', () => {
    const changes = collectForecastChanges('opportunity.updated', [
      { recordId: 'a', properties: { updatedFields: ['stage'] } },
      { recordId: 'a', properties: { updatedFields: ['probability'] } },
      { recordId: 'b', properties: { updatedFields: ['amount'] } },
    ]);

    expect(changes.get('a')).toEqual({ stageChanged: true, probabilitySetByUser: true, forecastCategorySetByUser: false });
    expect(changes.get('b')).toEqual(NOTHING);
    expect(collectForecastChanges('opportunity.deleted', [{ recordId: 'a', properties: {} }]).size).toBe(0);
  });

  it('treats a probability given at creation as set by hand', () => {
    expect(
      collectForecastChanges('opportunity.created', [{ recordId: 'a', properties: { after: { probability: 35 } } }]).get('a'),
    ).toEqual({ stageChanged: true, probabilitySetByUser: true, forecastCategorySetByUser: false });
  });
});

describe('applying forecasts', () => {
  it('reads current values and writes only opportunities that change', async () => {
    const { client, tables, updates } = createFakeCrmClient({
      opportunity: [
        { id: 'new', stage: 'SCREENING', amount: usd(500) },
        { id: 'settled', stage: 'NEW', amount: usd(100), probability: 10, forecastCategory: 'PIPELINE', expectedRevenue: usd(10) },
      ],
    });

    const updated = await applyOpportunityForecasts(client, new Map([['new', CREATED], ['settled', NOTHING]]));

    expect(updated).toBe(1);
    expect(updates.map(({ id }) => id)).toEqual(['new']);
    expect(tables.opportunity[0]).toMatchObject({ probability: 20, forecastCategory: 'PIPELINE', expectedRevenue: usd(100) });
  });

  it('backfills opportunities that predate the app, across pages', async () => {
    const opportunity = Array.from({ length: 450 }, (_, index) => ({ id: `o${index}`, stage: 'NEW', amount: usd(10) }));
    const { client, tables } = createFakeCrmClient({ opportunity });

    expect(await backfillOpportunityForecasts(client)).toBe(450);
    expect(tables.opportunity.every((row) => row.probability === 10)).toBe(true);
    expect(await backfillOpportunityForecasts(client)).toBe(0);
  });
});
