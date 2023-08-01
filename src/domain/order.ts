export type OrderType = 'web' | 'app' | 'rappi';

export interface OrderItem {
  sku: string;
  quantity: number;
}

export interface IOrder {
  id: number;
  saleorOrderId: number;
  deliveryDate: string;
  type: OrderType;
  lines: OrderItem[];
}

export class Order {
  id: number;

  saleorOrderId: number;

  deliveryDate: Date;

  type: OrderType;

  lines: OrderItem[];

  constructor(
    id: number,
    saleorOrderId: number,
    deliveryDate: Date,
    type: OrderType,
    lines: OrderItem[],
  ) {
    this.id = id;
    this.saleorOrderId = saleorOrderId;
    this.deliveryDate = deliveryDate;
    this.type = type;
    this.lines = lines;
  }

  toJSON() {
    return {
      id:            this.id,
      saleorOrderId: this.saleorOrderId,
      deliveryDate:  this.deliveryDate.toJSON(),
      type:          this.type,
      lines:         this.lines,
    };
  }

  static build(data: IOrder) {
    return new Order(
      data.id,
      data.saleorOrderId,
      new Date(data.deliveryDate),
      data.type,
      data.lines,
    );
  }
}
