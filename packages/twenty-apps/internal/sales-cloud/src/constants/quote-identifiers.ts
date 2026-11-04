// Universal identifiers are permanent: once installed in a workspace they key
// the metadata, so never regenerate or reuse one.

export const PRODUCT_UNIVERSAL_IDENTIFIER = 'f889dd2b-5ab1-43f1-8fef-7750ff5d44b6';
export const PRICE_BOOK_UNIVERSAL_IDENTIFIER = 'ddb72498-9f65-4918-a27f-7ee884f1fb50';
export const PRICE_BOOK_ENTRY_UNIVERSAL_IDENTIFIER = 'f4060ce0-c2a3-4926-9cef-3afa31e1946b';
export const QUOTE_UNIVERSAL_IDENTIFIER = 'e8c70575-9f85-4c92-aee3-ccb7a551e528';
export const QUOTE_LINE_ITEM_UNIVERSAL_IDENTIFIER = '2a12ab06-08a9-47a1-b478-f12024553ec2';

export const PRODUCT_FIELD_UNIVERSAL_IDENTIFIERS = {
  name: '0506fb7b-3d2c-4f55-9433-e34cc9d13056',
  productCode: 'b2d00947-89f5-4702-992f-4b89d7690c82',
  family: '41ca8372-0e21-410e-a81b-fed7b7641e76',
  isActive: '61f279e4-96f0-4172-ba2f-9231a754d64d',
  listPrice: '2e167e9f-61b7-426a-8eda-96fb5b0907b5',
  description: '44aa9a99-baf1-4cb9-8943-94e2a39dcd99',
} as const;

export const PRODUCT_FAMILY_OPTION_IDS = {
  HARDWARE: 'f59f48bf-f23d-454f-95b5-8dbcec4a4cfd',
  SOFTWARE: '624ab863-3e02-4a39-b6f7-1e2789f6f661',
  SERVICE: '02100498-3964-4938-ba3c-4909f7bbe5bc',
  SUBSCRIPTION: 'e3be3270-b57d-4429-b482-590de3d0c299',
  OTHER: '23f4bb5e-517e-4a46-a368-c9b04211d126',
} as const;

export const PRICE_BOOK_FIELD_UNIVERSAL_IDENTIFIERS = {
  name: '42c38d25-52e3-41a8-8eea-21bb70bef8c3',
  isActive: 'cbdca942-3d7e-416f-b10c-603ec0721085',
  description: 'e9cf5319-5313-4635-a8f7-55e4faafb969',
} as const;

export const PRICE_BOOK_ENTRY_FIELD_UNIVERSAL_IDENTIFIERS = {
  name: '14583517-fb71-48cc-9ce4-e4e8866e07bd',
  unitPrice: 'fad9fa51-29d9-4f15-a755-2ea17ddedfaa',
  isActive: 'b4b45c3c-0808-4f74-be13-1cb16a3e5d72',
} as const;

export const QUOTE_FIELD_UNIVERSAL_IDENTIFIERS = {
  name: '3ad439bf-3fa5-4d6c-981b-7892020868fc',
  status: '9ccca812-b881-4041-95f6-316906b0c284',
  expirationDate: '6c6e6ce9-9ade-4970-af38-4325e98514e5',
  syncToOpportunity: 'd06b6556-67d8-47e6-a3cb-64ce10112bcc',
  subtotal: '97ee6c36-bc4b-4d57-b0ab-0ff8d7c370cc',
  discountTotal: 'f69c2c58-ce78-433d-b739-fb23bf9a1dae',
  total: '41d6c8e3-c5c9-48a1-9845-6470eee8826d',
  lineItemCount: 'a9968b39-647f-43d6-a422-fcaa50d65ebe',
  pricingWarning: '12da6b3d-f144-4aec-9e21-48e125b12f9a',
  description: 'ecf6e4c7-e191-4e32-a42c-68a66ce59f91',
} as const;

export const QUOTE_STATUS_OPTION_IDS = {
  DRAFT: 'fe3ecd2d-2363-48fa-8204-720cb92d2e08',
  IN_REVIEW: '63028b58-3baa-48e2-a6d1-b2d231081ef2',
  PRESENTED: '1fd7151c-a166-4fd9-81cb-07985a28e5a8',
  ACCEPTED: '3bb3a58b-de59-4738-b1a3-60129d16fd5e',
  DENIED: '3c31cdc6-a5ac-4385-8d9f-54305a3956ec',
} as const;

export const QUOTE_LINE_ITEM_FIELD_UNIVERSAL_IDENTIFIERS = {
  name: '33bfec2d-b600-49aa-a1c0-2290ba8a2a69',
  quantity: 'c34eed95-395e-49a6-abf4-3084b5613d59',
  unitPrice: 'eb872c52-7eb0-49f8-a320-9672970082a6',
  discountPercent: 'cc6be705-d48b-475d-9798-8160ceea6df1',
  subtotal: '3e9431f3-0594-4236-a351-2e59f757c72f',
  total: '40072508-f0b1-407a-8855-71a88fe3aea3',
} as const;

export const QUOTE_RELATION_UNIVERSAL_IDENTIFIERS = {
  priceBookOnEntry: '9f43857a-5d59-47e2-a656-fa548f2283be',
  entriesOnPriceBook: 'fc2a4d0c-09f5-417c-af2b-813ac42942ee',
  productOnEntry: '12fcdc88-6a89-4d13-83e9-560c1ce7e4cd',
  priceBookEntriesOnProduct: '889bc62b-f1b7-4bf9-9392-7a9e37888d40',
  opportunityOnQuote: '793db068-d456-4efc-85a9-8b315d098405',
  quotesOnOpportunity: '03b0ae78-d61b-4623-8703-97dee6fb3248',
  priceBookOnQuote: '82046f0f-3b3f-4cd7-bab7-74af4552645a',
  quotesOnPriceBook: '58cf2d47-7798-4b59-a05a-1a3d7295717a',
  quoteOnLineItem: 'f1337568-a584-4067-b23a-b102cd171a69',
  lineItemsOnQuote: 'a221cd38-0ae4-47d7-bbf8-5ddec66404c0',
  productOnLineItem: 'd56fc1ea-a846-4a29-b92f-a28c368e1d77',
  quoteLineItemsOnProduct: 'fdd5f288-f29d-4773-a9f8-9247bb9c49f8',
} as const;

export const ALL_PRODUCTS_VIEW_UNIVERSAL_IDENTIFIER = '0c1a5807-a713-4b5b-9064-a6c80ac58168';
export const ALL_PRODUCTS_VIEW_FIELD_UNIVERSAL_IDENTIFIERS = [
  'c457f14c-323d-48f0-b101-3258bb00ecb9',
  'c5d179e6-b397-4c04-aa6d-1ec3d71cdd75',
  '256193c5-9955-4815-9d97-941825b2a637',
  '71feae4e-3a5f-4b58-b9c1-d8f9046563bd',
  '714bbdea-5a63-4949-86ed-e7d4d9196328',
  '4ca25156-c25a-4363-a199-15064b3546fa',
] as const;

export const ALL_PRICE_BOOKS_VIEW_UNIVERSAL_IDENTIFIER = 'a44b76ff-57d1-44de-898a-7f3e694b85d8';
export const ALL_PRICE_BOOKS_VIEW_FIELD_UNIVERSAL_IDENTIFIERS = [
  '4baa5bc0-f0b3-48d8-8707-ba4b0c543ee1',
  '65ad664f-37b5-493a-9a5f-747cf837d1e0',
  '906f0669-3769-49f9-aa34-782af095b999',
] as const;

export const ALL_PRICE_BOOK_ENTRIES_VIEW_UNIVERSAL_IDENTIFIER = '3e7823c8-9a08-46fe-8b68-ac9585b542e6';
export const ALL_PRICE_BOOK_ENTRIES_VIEW_FIELD_UNIVERSAL_IDENTIFIERS = [
  '059d2b7b-e3b6-40c9-b799-0f1bebd0be36',
  'ddc78389-1fe3-4fae-b270-0b17fdd6e4bf',
  'd398187e-3557-450f-aa08-a510c17b3238',
  'e34db201-6286-4058-8889-471704ffbce2',
] as const;

export const ALL_QUOTES_VIEW_UNIVERSAL_IDENTIFIER = 'c94be5d8-570e-4083-a8ac-94175ca31570';
export const ALL_QUOTES_VIEW_FIELD_UNIVERSAL_IDENTIFIERS = [
  '1b50eecf-963a-4096-b280-ed15c5c76747',
  '0dfee46f-483d-484e-a941-d75df858432b',
  'ef54e10a-4022-4612-9d6b-16f3e0ae5d4e',
  '85fcba40-c98a-4e98-8e84-de3b662bbdd9',
  '4af761ae-9299-4de6-ae12-a772e7ea6295',
  'ed4b14cc-5b00-4db1-9a49-7e1fed319755',
  '8550facf-4138-45da-ac41-a73358e2dadd',
  '30907eab-fd1b-496f-ab62-e4e2e5b27e71',
] as const;

export const ALL_QUOTE_LINE_ITEMS_VIEW_UNIVERSAL_IDENTIFIER = '4a056b40-e37d-4bdd-a3aa-620f02fa808c';
export const ALL_QUOTE_LINE_ITEMS_VIEW_FIELD_UNIVERSAL_IDENTIFIERS = [
  'b1c0cfd2-5e40-4dc5-aa95-0b66ccf5a2eb',
  '1eb954cf-97c7-4f08-8b35-44b58e98e7de',
  '6c56a0af-3465-4a3f-b434-ef49bd7660e4',
  '3f7e4e35-6396-429e-b03d-53f451ba5089',
  '36c2dc07-17fc-4d91-9af9-c42a6d8f6b30',
  'f98f3e87-4964-413f-9b5f-f6858d10ca80',
  '1828f428-8d05-485c-bf6d-a8d7c526a137',
] as const;

export const QUOTE_NAVIGATION_MENU_ITEM_UNIVERSAL_IDENTIFIERS = {
  products: '3798da47-9071-4108-bd0e-7f2e456b453e',
  priceBooks: 'a36ad1cf-a3db-4735-a48c-2e5447b3cd2b',
  quotes: '995aca48-f319-4bb3-8106-6913a9a11433',
} as const;

export const QUOTE_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIERS = {
  onQuoteLineItemChanged: '16a1b4ff-3573-4d3a-a41a-0878cb342ad7',
  onPriceBookEntryChanged: '93876a4f-084d-415c-8ee6-1ea2933a6baf',
  onQuoteChanged: '76013077-c3c7-45b1-b5fe-8d79afc21827',
} as const;
