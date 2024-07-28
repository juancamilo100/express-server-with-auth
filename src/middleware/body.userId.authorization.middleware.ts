import { NextFunction, Request, RequestHandler, Response } from "express";
import createError from "http-errors";

const authorizeBodyUserById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    if (req.userId! !== req.body.userId) { return next(createError(401, "Unauthorized")); }

    next();
};

export { authorizeBodyUserById };
