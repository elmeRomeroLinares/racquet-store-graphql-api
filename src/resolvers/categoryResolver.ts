import { AppDataSource } from '../data-source';
import { Category } from '../entities/Category';

export const categoryResolver = {
  Query: {
    getCategory: async (_: any, { id }: { id: string }) => {
      const categoryRepository = AppDataSource.getRepository(Category);
      return categoryRepository.findOneBy({ id });
    },
    getCategories: async (
      _: any,
      { limit = 10, offset = 0 }: { limit: number; offset: number }
    ) => {
      const categoryRepository = AppDataSource.getRepository(Category);

      // Get total count of categories
      const totalCount = await categoryRepository.count();

      // Get categories with pagination
      const categories = await categoryRepository.find({
        take: limit,
        skip: offset,
      });

      return {
        categories,
        totalCount,
        hasNextPage: offset + limit < totalCount,
        hasPreviousPage: offset > 0,
      };
    },
  },
  Mutation: {
    createCategory: async (_: any, { name }: { name: string }) => {
      const categoryRepository = AppDataSource.getRepository(Category);
      const category = categoryRepository.create({ name });
      await categoryRepository.save(category);
      return category;
    },
  },
};
