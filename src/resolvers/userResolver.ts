import { AppDataSource } from '../data-source';
import { User, UserRole } from '../entities/User';
import { JWTPayload } from '../types';
import { generateToken } from '../utils/auth';
import { comparePassword, hashPassword } from '../utils/hash';

export const userResolver = {
  Query: {
    getUser: async (_: any, { id }: { id: string }, context: { user: any }) => {
      const authenticatedUser = context.user as JWTPayload
      if (!authenticatedUser || authenticatedUser.role !== 'ADMIN') {
        throw new Error('Not authorized');
      }
      const userRepository = AppDataSource.getRepository(User);
      return userRepository.findOneBy({ id });
    },
    getUsers: async (_: any, context: { user: any }) => {
      const authenticatedUser = context.user as JWTPayload
      if (!authenticatedUser || authenticatedUser.role !== 'ADMIN') {
        throw new Error('Not authorized');
      }
      const userRepository = AppDataSource.getRepository(User);
      return userRepository.find();
    },
  },
  Mutation: {
    signup: async (_: any, { username, password, role }: { username: string; password: string; role: UserRole }) => {
      const userRepository = AppDataSource.getRepository(User);
      const hashedPassword = await hashPassword(password);
      const user = userRepository.create({ username, password: hashedPassword, role });
      await userRepository.save(user);
      return user;
    },
    signin: async (_: any, { username, password }: { username: string; password: string }) => {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ username });

      if (!user) {
        throw new Error('User not found');
      }

      const isValid = await comparePassword(password, user.password);

      if (!isValid) {
        throw new Error('Invalid password');
      }

      const token = generateToken(user.id, user.role);

      return { token }
    },
  },
};

