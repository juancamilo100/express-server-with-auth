import { NextFunction, Request, RequestHandler, Response } from "express";
import createError from "http-errors";

const authorizeUserById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    if (req.userId! !== Number.parseInt(req.params.userId, 10)) { 
        return next(createError(401, "Unauthorized")); 
    }

    next();
};

export { authorizeUserById };
