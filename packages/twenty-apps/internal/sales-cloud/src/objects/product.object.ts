import { defineObject, FieldType } from 'twenty-sdk/define';

import {
  PRODUCT_FIELD_UNIVERSAL_IDENTIFIERS as F,
  PRODUCT_UNIVERSAL_IDENTIFIER,
} from 'src/constants/quote-identifiers';
import { PRODUCT_FAMILY_OPTIONS } from 'src/constants/quote-options';

export default defineObject({
  universalIdentifier: PRODUCT_UNIVERSAL_IDENTIFIER,
  nameSingular: 'product',
  namePlural: 'products',
  labelSingular: 'Product',
  labelPlural: 'Products',
  description: 'Something you sell. Its list price is used when no price book sets one.',
  icon: 'IconPackage',
  labelIdentifierFieldMetadataUniversalIdentifier: F.name,
  fields: [
    { universalIdentifier: F.name, type: FieldType.TEXT, name: 'name', label: 'Name', icon: 'IconAbc' },
    { universalIdentifier: F.productCode, type: FieldType.TEXT, name: 'productCode', label: 'Product code', icon: 'IconBarcode', isNullable: true },
    { universalIdentifier: F.family, type: FieldType.SELECT, name: 'family', label: 'Product family', icon: 'IconCategory', isNullable: true, options: PRODUCT_FAMILY_OPTIONS },
    { universalIdentifier: F.isActive, type: FieldType.BOOLEAN, name: 'isActive', label: 'Active', description: 'Inactive products keep their quote lines but get no new prices', icon: 'IconToggleRight', defaultValue: true },
    { universalIdentifier: F.listPrice, type: FieldType.CURRENCY, name: 'listPrice', label: 'List price', icon: 'IconTag', isNullable: true },
    { universalIdentifier: F.description, type: FieldType.TEXT, name: 'description', label: 'Description', icon: 'IconNotes', isNullable: true },
  ],
});
