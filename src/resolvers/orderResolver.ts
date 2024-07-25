import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { Order, OrderStatus } from '../entities/Order';
import { OrderItem } from '../entities/OrderItem';
import { Cart } from '../entities/Cart';
import { CartItem } from '../entities/CartItem';

export const orderResolver = {
  Query: {
    getOrder: async (_: any, { id }: { id: string }): Promise<Order | null> => {
      const orderRepository = AppDataSource.getRepository(Order);
      return orderRepository.findOne({
        where: { id },
        relations: ['user', 'items', 'items.product'],
      });
    },
    getOrders: async (_: any, { userId }: { userId: string }): Promise<Order[]> => {
      const orderRepository = AppDataSource.getRepository(Order);
      return orderRepository.find({
        where: { user: { id: userId } },
        relations: ['items', 'items.product'],
      });
    },
  },
  Mutation: {
    createOrder: async (_: any, { userId }: { userId: string }): Promise<Order> => {
      const orderRepository = AppDataSource.getRepository(Order);
      const userRepository = AppDataSource.getRepository(User);
      const cartRepository = AppDataSource.getRepository(Cart);
      const cartItemRepository = AppDataSource.getRepository(CartItem);
      const orderItemRepository = AppDataSource.getRepository(OrderItem);

      const user = await userRepository.findOne({ where: { id: userId }, relations: ['cart', 'cart.items', 'cart.items.product'] });
      if (!user) {
        throw new Error('User not found');
      }

      if (!user.cart || user.cart.items.length === 0) {
        throw new Error('Cart is empty');
      }

      const order = orderRepository.create({ user, status: OrderStatus.PENDING });
      await orderRepository.save(order);

      for (const cartItem of user.cart.items) {
        const orderItem = orderItemRepository.create({ order, product: cartItem.product, quantity: cartItem.quantity });
        await orderItemRepository.save(orderItem);
      }

      order.items = await orderItemRepository.find({ where: { order: { id: order.id } }, relations: ['product'] });

      // Optionally, clear the user's cart
      user.cart.items = [];
      await cartItemRepository.remove(user.cart.items);

      return order;
    },
    updateOrderStatus: async (_: any, { id, status }: { id: string; status: OrderStatus }): Promise<Order> => {
      const orderRepository = AppDataSource.getRepository(Order);

      const order = await orderRepository.findOneBy({ id });
      if (!order) {
        throw new Error('Order not found');
      }

      order.status = status;
      await orderRepository.save(order);
      return order;
    },
  },
};
