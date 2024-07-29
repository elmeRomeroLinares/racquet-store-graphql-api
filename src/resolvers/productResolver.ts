import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";
import { Category } from "../entities/Category";
import {
  CreateProductArgs,
  JWTPayload,
  PaginationArgs,
  ProductsPage,
  UpdateProductsArgs,
} from "../types";
import { User } from "../entities/User";
import { url } from "inspector";

export const productResolver = {
  Query: {
    getProduct: async (
      _: any,
      { id }: { id: string }
    ): Promise<Product | null> => {
      const productRepository = AppDataSource.getRepository(Product);
      return productRepository.findOne({
        where: { id },
        relations: ["category"],
      });
    },
    getProducts: async (
      _: any,
      { limit = 10, offset = 0 }: PaginationArgs
    ): Promise<ProductsPage> => {
      const productRepository = AppDataSource.getRepository(Product);

      const totalCount = await productRepository.count();

      // Get products with pagination
      const products = await productRepository.find({
        take: limit,
        skip: offset,
        relations: ["category"],
      });

      return {
        products: products,
        totalCount: totalCount,
        hasNextPage: offset + limit < totalCount,
        hasPeviousPage: offset > 0,
      };
    },
    getProductsByCategoryId: async (
      _: any,
      {
        categoryId,
        limit = 10,
        offset = 0,
      }: { categoryId: string; limit: number; offset: number }
    ): Promise<ProductsPage> => {
      const productRepository = AppDataSource.getRepository(Product);

      // Get products by category with pagination
      const products = await productRepository.find({
        where: { category: { id: categoryId } },
        take: limit,
        skip: offset,
        relations: ["category"],
      });

      return {
        products: products,
        totalCount: products.length,
        hasNextPage: offset + limit < products.length,
        hasPeviousPage: offset > 0,
      };
    },
  },
  Mutation: {
    createProduct: async (
      _: any,
      { input }: CreateProductArgs,
      context: { user: any }
    ): Promise<Product> => {
      const authenticatedUser = context.user as JWTPayload;
      if (!authenticatedUser || authenticatedUser.role !== "ADMIN") {
        throw new Error("Not authorized");
      }

      const productRepository = AppDataSource.getRepository(Product);
      const categoryRepository = AppDataSource.getRepository(Category);

      const { name, price, categoryId, imageUrl, disabled } = input;

      const category = await categoryRepository.findOneBy({ id: categoryId });
      if (!category) {
        throw new Error("Category not found");
      }

      const product = productRepository.create({
        name,
        price,
        category,
        imageUrl,
        disabled,
      });
      await productRepository.save(product);
      return product;
    },
    updateProduct: async (
      _: any,
      { input }: UpdateProductsArgs,
      context: { user: any }
    ): Promise<Product> => {
      const authenticatedUser = context.user as JWTPayload;
      if (!authenticatedUser || authenticatedUser.role !== "ADMIN") {
        throw new Error("Not authorized");
      }

      const productRepository = AppDataSource.getRepository(Product);
      const categoryRepository = AppDataSource.getRepository(Category);

      const product = await productRepository.findOne({
        where: { id: input.id },
      });
      if (!product) {
        throw new Error(`Product with ID ${input.id} not found`);
      }

      if (input.categoryId) {
        const category = await categoryRepository.findOne({
          where: { id: input.categoryId },
        });
        if (!category) {
          throw new Error(`Category with ID ${input.categoryId} not found`);
        }
        product.category = category;
      }

      Object.assign(product, input);
      return await productRepository.save(product);
    },
    deleteProduct: async (
      _: any,
      { id }: { id: string },
      context: { user: any }
    ): Promise<boolean> => {
      const authenticatedUser = context.user as JWTPayload;
      if (!authenticatedUser || authenticatedUser.role !== "ADMIN") {
        throw new Error("Not authorized");
      }

      const productRepository = AppDataSource.getRepository(Product);

      const product = await productRepository.findOneBy({ id });
      if (!product) {
        throw new Error("Product not found");
      }

      await productRepository.remove(product);
      return true;
    },
    async likeProduct(
      _: any,
      { id }: { id: string },
      context: { user: any }
    ): Promise<Product[]> {
      const authenticatedUser = context.user as JWTPayload;
  
      if (!authenticatedUser) {
        throw new Error("Not authorized");
      }
  
      const userRepository = AppDataSource.getRepository(User);
      const productRepository = AppDataSource.getRepository(Product);
  
      const user = await userRepository.findOne({
        where: { id: authenticatedUser.id },
        relations: ["likedProducts"]
      });
      const product = await productRepository.findOneBy({ id });
  
      if (!user || !product) {
        throw new Error("User or Product not found");
      }

      if (user.likedProducts.some(p => p.id === product.id)) {
        return user.likedProducts
      }
  
      user.likedProducts.push(product)
      const modifiedUser = await userRepository.save(user);
  
      return modifiedUser.likedProducts;
    },
  },
};
