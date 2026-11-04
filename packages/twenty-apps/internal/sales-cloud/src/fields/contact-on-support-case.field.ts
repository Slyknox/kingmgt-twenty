import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  SUPPORT_CASE_RELATION_UNIVERSAL_IDENTIFIERS,
  SUPPORT_CASE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/support-case-identifiers';

export default defineField({
  universalIdentifier: SUPPORT_CASE_RELATION_UNIVERSAL_IDENTIFIERS.contactOnCase,
  objectUniversalIdentifier: SUPPORT_CASE_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'contact',
  label: 'Contact',
  icon: 'IconUser',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    SUPPORT_CASE_RELATION_UNIVERSAL_IDENTIFIERS.supportCasesOnPerson,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'contactId',
  },
});
