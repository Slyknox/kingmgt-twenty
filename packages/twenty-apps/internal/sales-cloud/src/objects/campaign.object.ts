import { defineObject, FieldType } from 'twenty-sdk/define';

import {
  CAMPAIGN_FIELD_UNIVERSAL_IDENTIFIERS as F,
  CAMPAIGN_UNIVERSAL_IDENTIFIER,
} from 'src/constants/campaign-forecast-identifiers';
import {
  CAMPAIGN_STATUS_OPTIONS,
  CAMPAIGN_TYPE_OPTIONS,
  CampaignStatus,
} from 'src/constants/campaign-options';

const CALCULATED = 'Calculated by Sales Cloud; manual edits are overwritten.';

export default defineObject({
  universalIdentifier: CAMPAIGN_UNIVERSAL_IDENTIFIER,
  nameSingular: 'campaign',
  namePlural: 'campaigns',
  labelSingular: 'Campaign',
  labelPlural: 'Campaigns',
  description:
    'A marketing effort. Leads and opportunities name it as their source, which drives its results and ROI.',
  icon: 'IconSpeakerphone',
  labelIdentifierFieldMetadataUniversalIdentifier: F.name,
  fields: [
    { universalIdentifier: F.name, type: FieldType.TEXT, name: 'name', label: 'Name', icon: 'IconAbc' },
    { universalIdentifier: F.type, type: FieldType.SELECT, name: 'type', label: 'Type', icon: 'IconCategory', isNullable: true, options: CAMPAIGN_TYPE_OPTIONS },
    {
      universalIdentifier: F.status,
      type: FieldType.SELECT,
      name: 'status',
      label: 'Status',
      icon: 'IconProgress',
      defaultValue: `'${CampaignStatus.PLANNED}'`,
      options: CAMPAIGN_STATUS_OPTIONS,
    },
    { universalIdentifier: F.startDate, type: FieldType.DATE, name: 'startDate', label: 'Start date', icon: 'IconCalendar', isNullable: true },
    { universalIdentifier: F.endDate, type: FieldType.DATE, name: 'endDate', label: 'End date', icon: 'IconCalendarDue', isNullable: true },
    { universalIdentifier: F.budgetedCost, type: FieldType.CURRENCY, name: 'budgetedCost', label: 'Budgeted cost', icon: 'IconReceipt', isNullable: true },
    { universalIdentifier: F.actualCost, type: FieldType.CURRENCY, name: 'actualCost', label: 'Actual cost', description: 'What ROI is measured against', icon: 'IconReceipt2', isNullable: true },
    { universalIdentifier: F.expectedRevenue, type: FieldType.CURRENCY, name: 'expectedRevenue', label: 'Expected revenue', description: 'Planned revenue for this campaign', icon: 'IconTargetArrow', isNullable: true },
    { universalIdentifier: F.description, type: FieldType.TEXT, name: 'description', label: 'Description', icon: 'IconNotes', isNullable: true },
    { universalIdentifier: F.leadCount, type: FieldType.NUMBER, name: 'leadCount', label: 'Leads', description: `Leads with this campaign as their source. ${CALCULATED}`, icon: 'IconUsers', isNullable: true },
    { universalIdentifier: F.convertedLeadCount, type: FieldType.NUMBER, name: 'convertedLeadCount', label: 'Converted leads', description: CALCULATED, icon: 'IconUserCheck', isNullable: true },
    { universalIdentifier: F.opportunityCount, type: FieldType.NUMBER, name: 'opportunityCount', label: 'Opportunities', description: `Opportunities with this campaign as their source. ${CALCULATED}`, icon: 'IconTargetArrow', isNullable: true },
    { universalIdentifier: F.wonOpportunityCount, type: FieldType.NUMBER, name: 'wonOpportunityCount', label: 'Won opportunities', description: CALCULATED, icon: 'IconTrophy', isNullable: true },
    { universalIdentifier: F.pipelineAmount, type: FieldType.CURRENCY, name: 'pipelineAmount', label: 'Open pipeline', description: `Amount of open opportunities, excluding Omitted. ${CALCULATED}`, icon: 'IconChartArrows', isNullable: true },
    { universalIdentifier: F.wonAmount, type: FieldType.CURRENCY, name: 'wonAmount', label: 'Won amount', description: CALCULATED, icon: 'IconCash', isNullable: true },
    { universalIdentifier: F.roiPercent, type: FieldType.NUMBER, name: 'roiPercent', label: 'ROI %', description: `(Won amount - actual cost) / actual cost. Empty without an actual cost. ${CALCULATED}`, icon: 'IconPercentage', isNullable: true },
    { universalIdentifier: F.otherCurrencyOpportunityCount, type: FieldType.NUMBER, name: 'otherCurrencyOpportunityCount', label: 'Opportunities in other currencies', description: `Opportunities left out of the amounts because their currency differs from the campaign's. ${CALCULATED}`, icon: 'IconCurrencyOff', isNullable: true },
    { universalIdentifier: F.rollupsUpdatedAt, type: FieldType.DATE_TIME, name: 'rollupsUpdatedAt', label: 'Results updated at', icon: 'IconRefresh', isNullable: true },
  ],
});
