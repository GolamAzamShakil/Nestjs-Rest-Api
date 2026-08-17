/* import { Document, Types } from 'mongoose';

import { User } from '../entities/user';
import { Product } from '../entities/product';
import { ProductDetails } from '../entities/product-details';

export interface UserDocument extends Omit<User, 'id'>, Document {
  id: string;
}

export interface ProductDetailsDocument
  extends Omit<ProductDetails, 'altId'>, Document {
  altId?: string;
}

export interface ProductDocument extends Omit<Product, 'details'>, Document {
  details: Types.ObjectId | ProductDetailsDocument;
}
*/
