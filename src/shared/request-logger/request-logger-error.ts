export class BunyanLoggerNotFoundError extends Error {
  constructor() {
    super(`Bunyan logger not found. Check logger is defined in express request object`);
  }
}
