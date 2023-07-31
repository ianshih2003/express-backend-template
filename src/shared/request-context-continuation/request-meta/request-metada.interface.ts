import { Request } from 'express';

export interface RequestMetadataResolver {
  (req: Request): Record<string, string>;
}
