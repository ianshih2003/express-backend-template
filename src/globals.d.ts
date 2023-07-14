import * as bunyan from 'bunyan';

declare global {
  namespace Express {
    interface Request {
      id: string;
      logger: bunyan | null;
    }
  }
}
