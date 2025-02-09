import { NextFunction, Request, RequestHandler, Response } from "express";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import { ENCRYPTION_KEY } from "../../config";

interface IDecodedToken {
    userId: number;
    role: string;
}

const authenticateUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	const token = req.header("authorization");
	if (!token) {
		return next(createError(401, "Unauthorized"));
	}

	try {
		const decodedToken = jwt.verify(token, ENCRYPTION_KEY!) as IDecodedToken;
        req.userId = decodedToken.userId;
        req.role = decodedToken.role;
		next();
	} catch (error) {
		return next(createError(401, "Unauthorized"));
	}
};

export { authenticateUser };
