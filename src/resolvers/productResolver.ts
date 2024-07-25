import { AppDataSource } from '../data-source';
import { Product } from '../entities/Product';
import { Category } from '../entities/Category';
import { CreateProductArgs, PaginationArgs, ProductsPage } from '../types';

export const productResolver = {
  Query: {
    getProduct: async (_: any, { id }: { id: string }): Promise<Product | null> => {
      const productRepository = AppDataSource.getRepository(Product);
      return productRepository.findOne({ 
        where: { id },
        relations: ['category'],
      });
    },
    getProducts: async (_: any, { limit = 10, offset = 0 }: PaginationArgs): Promise<ProductsPage> => {
      const productRepository = AppDataSource.getRepository(Product);

      const totalCount = await productRepository.count();

      // Get products with pagination
      const products = await productRepository.find({
        take: limit,
        skip: offset,
        relations: ['category'],
      });

      return {
        products: products,
        totalCount: totalCount,
        hasNextPage: offset + limit < totalCount,
        hasPeviousPage: offset > 0
      };
    },
    getProductsByCategoryId: async (_: any, { categoryId, limit = 10, offset = 0 }: { categoryId: string; limit: number; offset: number }): Promise<ProductsPage> => {
      const productRepository = AppDataSource.getRepository(Product);

      // Get products by category with pagination
      const products = await productRepository.find({
        where: { category: { id: categoryId } },
        take: limit,
        skip: offset,
        relations: ['category'],
      });

      return {
        products: products,
        totalCount: products.length,
        hasNextPage: offset + limit < products.length,
        hasPeviousPage: offset > 0
      };
    },
  },
  Mutation: {
    createProduct: async (_: any, { input }: CreateProductArgs): Promise<Product> => {
      const productRepository = AppDataSource.getRepository(Product);
      const categoryRepository = AppDataSource.getRepository(Category);

      const { name, price, categoryId, imageUrl, disabled } = input;

      const category = await categoryRepository.findOneBy({ id: categoryId });
      if (!category) {
        throw new Error('Category not found');
      }

      const product = productRepository.create({ name, price, category, imageUrl, disabled });
      await productRepository.save(product);
      return product;
    },
  },
};
