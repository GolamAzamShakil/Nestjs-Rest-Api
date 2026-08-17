import { ProductDetails } from './product-details';

export interface Product {
  id: string;

  name: string;

  details: ProductDetails | string;
}
