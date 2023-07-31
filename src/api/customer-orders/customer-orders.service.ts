import { CustomerOrder } from '@domain/customer-order';

export interface ICustomersService {
  create(customerOrder: CustomerOrder): Promise<CustomerOrder>;
  find(): Promise<CustomerOrder[]>;
  findOne(id: number): Promise<CustomerOrder>;
  update(id: number, customerOrder: Partial<CustomerOrder>): Promise<CustomerOrder>;
}

export const ExampleCustomerOrders = [
  new CustomerOrder(1, 1, new Date('2020-01-01'), 'rappi', [
    {
      sku:      '123',
      quantity: 1
    },
    {
      sku:      '456',
      quantity: 2
    }
  ]),
  new CustomerOrder(2, 2, new Date('2021-01-01'), 'web', [
    {
      sku:      '789',
      quantity: 3
    },
    {
      sku:      '11524',
      quantity: 2
    }
  ])
];

export class CustomerOrdersService implements ICustomersService {
  create(customerOrder: CustomerOrder): Promise<CustomerOrder> {
    return Promise.resolve(customerOrder);
  }

  find(): Promise<CustomerOrder[]> {
    return Promise.resolve(ExampleCustomerOrders);
  }

  findOne(id: number): Promise<CustomerOrder> {
    return Promise.resolve(ExampleCustomerOrders.find(customerOrder => customerOrder.id === id));
  }

  async update(id: number, customerOrder: Partial<CustomerOrder>): Promise<CustomerOrder> {
    const customerOrderToUpdate = await this.findOne(id);

    return Promise.resolve({
      ...customerOrderToUpdate,
      ...customerOrder
    });
  }
}

export const ordersService = new CustomerOrdersService();
