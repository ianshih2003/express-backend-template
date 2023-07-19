import { RequestHandler } from 'express';

export function health(): RequestHandler {
  return (_req, res) => {
    res.status(200).json({ uptime: process.uptime() });
  };
}
