export enum ProductCategory {
  ELECTRICS = 'electrics',
  CLOTHING = 'clothings',
  APPLIANCES = 'appliances',
  GROCERIES = 'groceries',
  BOOKS = 'books',
}

export interface ProductDetails {
  altId?: string;

  category: ProductCategory;

  image?: string;

  availability: number;
}
