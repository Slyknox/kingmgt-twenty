# Sales Cloud

Salesforce-style sales objects for Twenty, shipped as an installable app so the
fork keeps merging cleanly from upstream.

## What it adds

- **Lead** object: name, company, job title, emails, phones, website, status,
  lead source, rating, annual revenue, employees, description.
- **Lead conversion**, like Salesforce's Convert Lead. Converting a lead:
  1. reuses a company with the same name (case-insensitive), or creates one
     from the lead's company, website and annual revenue;
  2. reuses a person with the same primary email, or creates one;
  3. creates an opportunity named `<company> - <person>` at stage New;
  4. marks the lead Converted and links the company, person and opportunity on
     it (each of those shows its "Converted from leads").
- Three ways to convert:
  - the **Convert lead** command on one or more selected leads;
  - dragging a card to **Converted** on the Lead Pipeline kanban;
  - the **Convert Lead** workflow action.
- Views: **All Leads** (table) and **Lead Pipeline** (kanban by status).

## Campaigns

- **Campaign** object: name, type, status, start and end dates, budgeted cost,
  actual cost, expected revenue and description.
- Leads and opportunities get a **Campaign source** (Salesforce's Primary
  Campaign Source). Converting a lead copies its campaign onto the new
  opportunity.
- Each campaign shows its results, kept up to date automatically: leads,
  converted leads, opportunities, won opportunities, open pipeline, won amount
  and **ROI %** = (won amount - actual cost) / actual cost.
  - Won means the opportunity is at the Customer stage. Open pipeline leaves
    out won deals and deals in the Omitted forecast category.
  - Amounts are added up in one currency (the campaign's cost currency, or the
    one most of its deals use) and never converted. Deals in another currency
    are counted in "Opportunities in other currencies" instead.
- **All Campaigns** table view.

## Forecasting

- Opportunities get **Probability %**, **Forecast category** (Pipeline, Best
  case, Commit, Closed, Omitted) and **Expected revenue** = amount ×
  probability.
- Changing the stage sets probability and category from the stage, as in
  Salesforce. Edit either by hand to override until the next stage change:

  | Stage     | Probability | Forecast category |
  |-----------|-------------|-------------------|
  | New       | 10%         | Pipeline          |
  | Screening | 20%         | Pipeline          |
  | Meeting   | 40%         | Best case         |
  | Proposal  | 70%         | Commit            |
  | Customer  | 100%        | Closed            |

  A workspace's own custom stages keep whatever probability and category you
  give them. Move a lost deal to **Omitted** to take it out of the forecast.
- **Forecast** kanban on opportunities, grouped by forecast category.
- **Forecast** dashboard: open pipeline, weighted pipeline, commit and closed
  totals, weighted pipeline by close month, amount by category, and campaign
  results by campaign type.
- On install, and every night at 03:17 UTC, the app fills forecast fields on
  opportunities that lack them and recalculates every campaign, so nothing
  stays stale if an update was missed.

## Leads: notes

Converting twice is harmless: a lead that already has an opportunity is
skipped. If a step fails, the records that conversion created are moved to the
trash, the lead goes back to Qualified, and the reason is shown in its
**Conversion error** field. Conversion handles at most 100 leads per call.

## Develop

```bash
yarn install
yarn twenty dev:build   # build the manifest and typecheck
yarn test               # unit tests
yarn twenty dev         # sync to a running Twenty server
```

Not yet built: products and price books, quotes, cases, and campaign members
(a lead or person belonging to several campaigns).
