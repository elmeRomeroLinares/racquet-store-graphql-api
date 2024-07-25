import { Product } from "./entities/Product";

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

export interface ProductsPage {
    products: Product[]
    totalCount: number
    hasNextPage: Boolean
    hasPeviousPage: Boolean
}

export interface PaginationArgs {
  limit?: number;
  offset?: number;
}
