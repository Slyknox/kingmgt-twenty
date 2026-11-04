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
    one most of its deals use). Deals in another currency are converted with
    the workspace's **exchange rates**; one with no rate is left out and
    counted in "Opportunities in other currencies".
- **All Campaigns** table view.

Campaign members: add any number of leads or people to a campaign as
**Campaign members** (status Sent or Responded). Each campaign counts its
members and responses. A member's name fills in as "<campaign> - <member>",
and the first response time is stamped. Converting a lead moves its
memberships onto the new person.

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

## Products, price books and quotes

- **Product**: name, code, family, list price, active.
- **Price book** with **price book entries**: one product's price in one
  price book. An entry's name fills in as "<product> - <price book>".
- **Quote** on an opportunity, with a price book, status (Draft, In review,
  Presented, Accepted, Denied) and expiration date.
- **Quote line items**: picking a product names the line and sets its unit
  price from the quote's price book (the active entry), or else the
  product's list price. A price typed in the same edit is kept.
  - Quantity defaults to 1. Discount % is held between 0 and 100.
  - Line subtotal = quantity × unit price; line total = subtotal less discount.
- The quote's subtotal, discount, total and line count update automatically.
  Lines are added in one currency (the one most lines use). Lines in another
  currency are converted with the exchange rates; **Pricing warning** says
  which lines were converted, and which were left out for having no price or
  no rate.
- **Sync to opportunity** keeps the opportunity's amount equal to the quote
  total, as in Salesforce. Only one quote per opportunity syncs: turning it on
  turns it off on that opportunity's other quotes.
- Changing a quote's price book re-prices its lines from the new book (or the
  list price). A line whose price someone typed (one that matches neither the
  old book's price nor the list price) keeps it.

## Currencies

- **Exchange rate** object, like Salesforce's Manage Currencies: one row per
  currency, with **Rate** = how many of that currency equal 1 of the
  corporate currency. Mark one row **Corporate** (its rate is 1).
- Campaign results and quote totals convert through these rates. With no
  corporate currency, nothing is converted and other currencies are left out
  and counted, as before. Changing a rate recalculates every campaign and
  quote.
- Optional daily update from the European Central Bank's free reference rates:
  set the app setting `SALES_CLOUD_ECB_RATES_ENABLED` to `true`. It runs on
  weekdays at 15:41 UTC, updates only the currencies you have added, and skips
  rows with **Update daily** switched off. It is the only part of the app that
  calls the internet, and it is off by default.
- Opportunity forecast amounts (expected revenue) stay in the deal's own
  currency.

## Cases

- **Case** object (stored as `supportCase`, since CASE is an SQL keyword):
  subject, status (New, Working, Escalated, On hold, Closed), priority,
  origin, type, description, resolution, company, contact and owner.
- Each case gets a **Due by** deadline from its priority:

  | Priority | Due within |
  |----------|------------|
  | Critical | 4 hours    |
  | High     | 8 hours    |
  | Medium   | 24 hours   |
  | Low      | 72 hours   |

  Change these in `src/constants/support-case-options.ts`.
- **First responded at** is stamped when a case first leaves New, and
  **Closed at** when it closes (cleared if reopened).
- **Overdue** is set when a case closes after its deadline, and every hour
  for open cases past it.
- **All Cases** table, **Case Board** kanban by status, and a **Service**
  dashboard: open cases, overdue open cases, open cases by priority, cases by
  status.

## Permissions

Lead conversion runs as the user who converts, so their permissions apply.
Everything else (forecasts, campaign results, quote totals, case deadlines,
the nightly and hourly jobs) runs as the app, so totals cover every record.
The app's role may destroy records only to undo a conversion that failed
halfway, removing exactly the records that conversion created.

## Leads: notes

Converting twice is harmless: a lead that already has an opportunity is
skipped. If a step fails, the records that conversion created are deleted
(not trashed, so their email and website are free for a retry), the lead goes
back to Qualified, and the reason is shown in its **Conversion error** field.
Conversion handles at most 100 leads per call. A company is reused when its
name or its website matches the lead's. A lead created or imported as
Converted is converted too.

## Develop

```bash
yarn install
yarn twenty dev:build   # build the manifest and typecheck
yarn test               # unit tests
yarn twenty dev         # sync to a running Twenty server
```

Deleting a quote, campaign, product or price book moves it to the trash and
leaves its line items, members and entries in place; they are removed only
when the parent is deleted for good.
