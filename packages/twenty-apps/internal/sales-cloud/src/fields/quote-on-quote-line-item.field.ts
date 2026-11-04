import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';

import {
  QUOTE_LINE_ITEM_UNIVERSAL_IDENTIFIER,
  QUOTE_RELATION_UNIVERSAL_IDENTIFIERS,
  QUOTE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/quote-identifiers';

export default defineField({
  universalIdentifier: QUOTE_RELATION_UNIVERSAL_IDENTIFIERS.quoteOnLineItem,
  objectUniversalIdentifier: QUOTE_LINE_ITEM_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'quote',
  label: 'Quote',
  icon: 'IconFileInvoice',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier: QUOTE_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    QUOTE_RELATION_UNIVERSAL_IDENTIFIERS.lineItemsOnQuote,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.CASCADE,
    joinColumnName: 'quoteId',
  },
});
