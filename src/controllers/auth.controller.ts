import bcrypt from "bcryptjs";
import { NextFunction, Request, RequestHandler, Response } from "express";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import { ENCRYPTION_KEY } from "../../config";
import User from "../database/entities/user.entity";
import IDataService from "../interfaces/data.service.interface";
import Validator from '../utils/validator';

class AuthController {
    constructor(
        private userService: IDataService<User>,
        private validate: Validator) {}

    public loginUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.body.email || !req.body.password) {
            return next(createError(400, "Incomplete request"));
        }

        try {
            this.validate.isEmail(req.body.email);
            const user =  await this.userService.getByFields(
                { email: req.body.email },
                { hiddenFieldsToShow: ["password"] }
            );

            if (!user) { return next(createError(401, "Unauthorized")); }

            const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordIsValid) { return next(createError(401, "Unauthorized")); }

            const token = jwt.sign(
                {
                    userId: user.id
                },
                ENCRYPTION_KEY!,
                { expiresIn: 3600 }
            );

            res.send({ token });
        } catch (error) {
            return next(createError(500, error as any));
        }
    }

    public registerUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.body.email ||
            !req.body.password ||
            !req.body.firstName ||
            !req.body.lastName
        ) {
            return next(createError(400, "Incomplete request"));
        }
        
        const userToRegister = req.body;
        
        try {
            this.validate.isEmail(userToRegister.email);
            await this.validate.userExists(userToRegister.email);
        } catch (error) {
            return next(createError(400, error as any));
        }
        
        const hashedPassword = bcrypt.hashSync(userToRegister.password);
        
        try {
            userToRegister.password = hashedPassword;

            const createdUser = await this.userService.create(userToRegister);
            const token = jwt.sign(
                {
                    userId: createdUser.id
                },
                ENCRYPTION_KEY!,
                { expiresIn: 3600 }
            );
            res.send({ auth: true, token });
        } catch (error) {
            return next(createError(500, error as any));
        }
    }
}

export default AuthController;
