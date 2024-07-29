import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Order, OrderStatus } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";
import { JWTPayload, PaginationArgs } from "../types";

export const orderResolver = {
  Query: {
    getOrder: async (
      _: any,
      { id }: { id: string },
      context: { user: any }
    ): Promise<Order | null> => {
      const authenticatedUser = context.user as JWTPayload;
      if (!authenticatedUser) {
        throw new Error("Not authorized");
      }

      const orderRepository = AppDataSource.getRepository(Order);
      const order = await orderRepository.findOne({
        where: { id },
        relations: ["user", "items", "items.product"],
      });
      if (
        order?.user.id !== authenticatedUser.id ||
        authenticatedUser.role !== "ADMIN"
      ) {
        throw new Error("Not authorized");
      }
      return order;
    },
    getUserOrders: async (
      _: any,
      { userId }: { userId?: string },
      context: { user: any }
    ): Promise<Order[]> => {
      const authenticatedUser = context.user as JWTPayload;
    
      if (!authenticatedUser) {
        throw new Error("Not authorized");
      }
    
      const targetUserId = authenticatedUser.role === "ADMIN" && userId ? userId : authenticatedUser.id;
    
      const orderRepository = AppDataSource.getRepository(Order);
      return orderRepository.find({
        where: { user: { id: targetUserId } },
        relations: ["items", "items.product"],
      });
    },
    getUsersOrders: async (
      _: any,
      { limit = 10, offset = 0 }: PaginationArgs,
      context: { user: any }
    ): Promise<Order[]> => {
      const authenticatedUser = context.user as JWTPayload;
      if (!authenticatedUser || authenticatedUser.role !== "ADMIN") {
        throw new Error("Not authorized");
      }
      const orderRepository = AppDataSource.getRepository(Order);
      return orderRepository.find({
        take: limit,
        skip: offset,
        relations: ["user", "items", "items.product"],
      });
    },
  },
  Mutation: {
    createOrder: async (
      _: any,
      { userId }: { userId?: string },
      context: { user: any }
    ): Promise<Order> => {
      const authenticatedUser = context.user as JWTPayload;
      if (!authenticatedUser) {
        throw new Error("Not authorized");
      }    
      const targetUserId = authenticatedUser.role === "ADMIN" && userId ? userId : authenticatedUser.id;

      const orderRepository = AppDataSource.getRepository(Order);
      const userRepository = AppDataSource.getRepository(User);
      const cartItemRepository = AppDataSource.getRepository(CartItem);
      const orderItemRepository = AppDataSource.getRepository(OrderItem);

      const user = await userRepository.findOne({
        where: { id: targetUserId },
        relations: ["cart", "cart.items", "cart.items.product"],
      });
      if (!user) {
        throw new Error("User not found");
      }

      if (!user.cart || user.cart.items.length === 0) {
        throw new Error("Cart is empty");
      }

      const order = orderRepository.create({
        user,
        status: OrderStatus.PENDING,
      });
      await orderRepository.save(order);

      for (const cartItem of user.cart.items) {
        const orderItem = orderItemRepository.create({
          order,
          product: cartItem.product,
          quantity: cartItem.quantity,
        });
        await orderItemRepository.save(orderItem);
      }

      order.items = await orderItemRepository.find({
        where: { order: { id: order.id } },
        relations: ["product"],
      });

      user.cart.items = [];
      await cartItemRepository.remove(user.cart.items);

      return order;
    },
    updateOrderStatus: async (
      _: any,
      { id, status }: { id: string; status: OrderStatus }
    ): Promise<Order> => {
      const orderRepository = AppDataSource.getRepository(Order);

      const order = await orderRepository.findOneBy({ id });
      if (!order) {
        throw new Error("Order not found");
      }

      order.status = status;
      await orderRepository.save(order);
      return order;
    },
  },
};
