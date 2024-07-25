import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";
import { Product } from "../entities/Product";

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
      {
        userId,
        input,
      }: { userId: string; input: { productId: string; quantity: number } }
    ): Promise<Cart> => {
      const cartRepository = AppDataSource.getRepository(Cart);
      const userRepository = AppDataSource.getRepository(User);
      const productRepository = AppDataSource.getRepository(Product);
      const cartItemRepository = AppDataSource.getRepository(CartItem);

      const user = await userRepository.findOne({
        where: { id: userId },
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
      cart.items = await cartItemRepository.find({
        where: { cart: { id: cart.id } },
        relations: ["product"],
      });

      return cart;
    },
  },
};
