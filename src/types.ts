import { Product } from './entities/Product';
import { UserRole } from './entities/User';

export interface CreateProductRequest {
  name: string;
  price: number;
  categoryId: string;
  imageUrl?: string;
  disabled?: boolean;
}

export interface CreateProductArgs {
  input: CreateProductRequest;
}

export interface UpdateProductRequest {
  id: string;
  name?: string;
  price?: number;
  categoryId?: string;
  imageUrl?: string;
  disabled?: boolean;
}

export interface UpdateProductsArgs {
  input: UpdateProductRequest;
}

export interface ProductsPage {
  products: Product[];
  totalCount: number;
  hasNextPage: boolean;
  hasPeviousPage: boolean;
}

export interface AddProductToCartRequest {
  productId: string;
  quantity: number;
}

export interface AddProductToCartArgs {
  input: AddProductToCartRequest;
}

export interface PaginationArgs {
  limit?: number;
  offset?: number;
}

export interface JWTPayload {
  id: string;
  role: UserRole;
}
