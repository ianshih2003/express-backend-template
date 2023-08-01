import { IOrder, Order } from '@domain/order';

export interface IOrderService {
  create(customerOrder: Order): Promise<Order>;
  find(): Promise<Order[]>;
  findOne(id: number): Promise<Order>;
  update(id: number, customerOrder: Partial<IOrder>): Promise<Order>;
}

export const ExampleOrders: Order[] = [
  new Order(1, 1, new Date('2020-01-01'), 'rappi', [
    {
      sku:      '123',
      quantity: 1,
    },
    {
      sku:      '456',
      quantity: 2,
    },
  ]),
  new Order(2, 2, new Date('2021-01-01'), 'web', [
    {
      sku:      '789',
      quantity: 3,
    },
    {
      sku:      '11524',
      quantity: 2,
    },
  ]),
];

export class OrderService implements IOrderService {
  create(customerOrder: Order): Promise<Order> {
    return Promise.resolve(customerOrder);
  }

  find(): Promise<Order[]> {
    return Promise.resolve(ExampleOrders);
  }

  findOne(id: number): Promise<Order> {
    return Promise.resolve(ExampleOrders.find(order => order.id === id));
  }

  async update(id: number, order: Partial<IOrder>): Promise<Order> {
    const orderToUpdate = await this.findOne(id);

    return Promise.resolve(
      Order.build({
        ...orderToUpdate.toJSON(),
        ...order,
      }),
    );
  }
}

export const ordersService = new OrderService();
