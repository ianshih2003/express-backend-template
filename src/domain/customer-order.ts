export type CustomerOrderType = 'web' | 'app' | 'rappi';

export interface CustomerOrderItem {
  sku: string;
  quantity: number;
}

export class CustomerOrder {
  id: number;

  saleorOrderId: number;

  deliveryDate: Date;

  type: CustomerOrderType;

  lines: CustomerOrderItem[];

  constructor(
    id: number,
    saleorOrderId: number,
    deliveryDate: Date,
    type: CustomerOrderType,
    lines: CustomerOrderItem[],
  ) {
    this.id = id;
    this.saleorOrderId = saleorOrderId;
    this.deliveryDate = deliveryDate;
    this.type = type;
    this.lines = lines;
  }
}
