import { Request } from 'express';

export interface IRequestMetadataResolver {
  (req: Request): Record<string, string>;
}
