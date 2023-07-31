import { Router } from 'express';
import { CustomerOrdersController } from './customer-orders.controller';

const RESOURCE_PATH = '/orders';

export default function getRouter(controller = new CustomerOrdersController()): Router {
  const ordersRouter: Router = Router();
  ordersRouter.post(RESOURCE_PATH, (req, res, next) => controller.createOrder(req, res, next));
  ordersRouter.get(`${RESOURCE_PATH}/:id`, (req, res, next) => controller.getOrder(req, res, next));
  ordersRouter.get(RESOURCE_PATH, (req, res, next) => controller.getOrders(req, res, next));
  ordersRouter.patch(`${RESOURCE_PATH}/:id`, (req, res, next) =>
    controller.updateOrder(req, res, next),
  );
  return ordersRouter;
}
