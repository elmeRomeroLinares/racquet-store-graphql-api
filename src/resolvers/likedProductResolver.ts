// import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
// import { Product } from "../entities/Product"; // Adjust the import path according to your structure
// import { User } from "../entities/User"; // Adjust the import path according to your structure
// import { AppDataSource } from "../data-source"; // Adjust the import path according to your structure
// import { JWTPayload } from "../types";

// @Resolver()
// export class LikedProductResolver {
//   @Mutation(() => Boolean)
//   async likeProduct(
//     @Arg("productId") productId: string,
//     @Ctx() context: { user: any }
//   ): Promise<Product[]> {
//     const authenticatedUser = context.user as JWTPayload;

//     if (!authenticatedUser) {
//       throw new Error("Not authorized");
//     }

//     const userRepository = AppDataSource.getRepository(User);
//     const productRepository = AppDataSource.getRepository(Product);

//     const user = await userRepository.findOne({
//       where: { id: authenticatedUser.id },
//       relations: ["likedProducts"]
//     });
//     const product = await productRepository.findOneBy({ id: productId });

//     if (!user || !product) {
//       throw new Error("User or Product not found");
//     }

//     user.likedProducts = [...user.likedProducts, product];
//     const modifiedUser = await userRepository.save(user);

//     return modifiedUser.likedProducts;
//   }
// }
