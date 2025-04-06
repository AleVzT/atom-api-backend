import { NextFunction, Request, Response } from 'express';

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return fn(req, res, next).catch(next);
  };
};
