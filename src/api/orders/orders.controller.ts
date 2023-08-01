import { ApiError } from '@shared/api-error';
import { NextFunction, Request, Response } from 'express';
import { IOrderService, ordersService as defaultOrderService } from './orders.service';

export class OrderController {
  constructor(private readonly orderService: IOrderService = defaultOrderService) {}

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await this.orderService.create(req.body);
      return res.json(order);
    } catch (error) {
      next(ApiError.fromError(error));
    }
  }

  async getOrders(_req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await this.orderService.find();
      return res.json(orders);
    } catch (error) {
      next(ApiError.fromError(error));
    }
  }

  async getOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);

      const order = await this.orderService.findOne(id);
      return res.json(order);
    } catch (error) {
      next(ApiError.fromError(error));
    }
  }

  async updateOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const order = await this.orderService.update(id, req.body);
      return res.json(order);
    } catch (error) {
      next(ApiError.fromError(error));
    }
  }
}
