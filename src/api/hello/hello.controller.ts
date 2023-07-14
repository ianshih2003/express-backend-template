import { NextFunction, Request, Response } from 'express';

export async function hello(req: Request, res: Response, next: NextFunction) {
    res.json({ hello: 'hello world!' });
}