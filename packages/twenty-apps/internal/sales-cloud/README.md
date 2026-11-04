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

Not yet built: products and price books, quotes, cases, campaigns and forecasting.
