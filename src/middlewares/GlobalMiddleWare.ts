import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export class GlobalMiddleWare {
  static checkError(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(new Error(errors.array()[0].msg));
    } else {
      next();
    }
  }
}
