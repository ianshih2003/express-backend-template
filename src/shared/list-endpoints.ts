import { Application } from 'express';
import listResources from 'express-list-routes';

export function listEndpoints(expressApp: Application, path: string) {
  listResources(expressApp, { prefix: path });
}
