import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";
import { Product } from "../entities/Product";
import { AddProductToCartArgs, JWTPayload } from "../types";

export const cartResolver = {
  Query: {
    getCart: async (
      _: any,
      { userId }: { userId: string }
    ): Promise<Cart | null> => {
      const cartRepository = AppDataSource.getRepository(Cart);
      const userRepository = AppDataSource.getRepository(User);

      const user = await userRepository.findOne({
        where: { id: userId },
        relations: ["cart", "cart.items", "cart.items.product"],
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user.cart;
    },
  },
  Mutation: {
    addToCart: async (
      _: any,
      { input }: AddProductToCartArgs,
      context: { user: any }
    ): Promise<Cart> => {
      const authenticatedUser = context.user as JWTPayload;
      if (!authenticatedUser) {
        throw new Error("Not authorized");
      }

      const cartRepository = AppDataSource.getRepository(Cart);
      const userRepository = AppDataSource.getRepository(User);
      const productRepository = AppDataSource.getRepository(Product);
      const cartItemRepository = AppDataSource.getRepository(CartItem);

      const user = await userRepository.findOne({
        where: { id: authenticatedUser.id },
        relations: ["cart"],
      });
      if (!user) {
        throw new Error("User not found");
      }

      let cart = user.cart;
      if (!cart) {
        cart = cartRepository.create({ user });
        await cartRepository.save(cart);
      }

      const product = await productRepository.findOneBy({
        id: input.productId,
      });
      if (!product) {
        throw new Error("Product not found");
      }

      let cartItem = await cartItemRepository.findOne({
        where: { cart: { id: cart.id }, product: { id: product.id } },
      });
      if (cartItem) {
        cartItem.quantity += input.quantity;
      } else {
        cartItem = cartItemRepository.create({
          cart,
          product,
          quantity: input.quantity,
        });
      }

      await cartItemRepository.save(cartItem);

      const updatedCart = await cartRepository.findOne({
        where: { id : cart.id},
        relations: ["user", "items", "items.product"]
      })

      if (updatedCart === null) {
        throw new Error("Something went wrong when adding the product to cart")
      }

      return updatedCart;
    },
  },
};
