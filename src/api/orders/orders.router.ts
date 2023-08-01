import { Router } from 'express';
import { OrderController } from './orders.controller';

export const ORDER_PATH = '/orders';

export default function getRouter(controller = new OrderController()): Router {
  const ordersRouter: Router = Router();
  ordersRouter.post(ORDER_PATH, (req, res, next) => controller.createOrder(req, res, next));
  ordersRouter.get(`${ORDER_PATH}/:id`, (req, res, next) => controller.getOrder(req, res, next));
  ordersRouter.get(ORDER_PATH, (req, res, next) => controller.getOrders(req, res, next));
  ordersRouter.patch(`${ORDER_PATH}/:id`, (req, res, next) =>
    controller.updateOrder(req, res, next)
  );
  return ordersRouter;
}
