import { ApiError } from '@shared/api-error';
import { NextFunction, Request, Response } from 'express';
import { ICustomersService, ordersService as defaultOrderService } from './customer-orders.service';

export class CustomerOrdersController {
  constructor(private readonly ordersService: ICustomersService = defaultOrderService) {}

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const resources = await this.ordersService.create(req.body);
      return res.json(resources);
    } catch (error) {
      next(ApiError.fromError(error));
    }
  }

  async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const resources = await this.ordersService.find();
      return res.json(resources);
    } catch (error) {
      next(ApiError.fromError(error));
    }
  }

  async getOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);

      const resources = await this.ordersService.findOne(id);
      return res.json(resources);
    } catch (error) {
      next(ApiError.fromError(error));
    }
  }

  async updateOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const resources = await this.ordersService.update(id, req.body);
      return res.json(resources);
    } catch (error) {
      next(ApiError.fromError(error));
    }
  }
}
