import bcrypt from "bcryptjs";
import {
    NextFunction,
    Request,
    RequestHandler,
    Response } from "express";
import createError from "http-errors";
import { ObjectLiteral } from "../../types/generics";
import User from "../database/entities/user.entity";
import IDataService from "../interfaces/data.service.interface";
import { toCamelCaseAllPropsKeys, toTitleCase } from "../utils/formatter";
import Validator from '../utils/validator';

class UsersController {
    constructor(
        private userService: IDataService<User>,
        private validate: Validator) {}

    public getUsers: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const users = await this.userService.getAll();

        res.send(users.map((user) => {
            return this.formatUserProps(user);
        }));
    }

    public getUserById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.validate.userId(req.params.userId);
            res.send(this.formatUserProps(user));
        } catch (error) {
            return next(createError(500, error as any));
        }
    }

    public deleteUserById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.validate.userId(req.params.userId);
            await this.userService.delete(req.params.userId);
            res.sendStatus(200);
        } catch (error) {
            return next(createError(500, error as any));
        }
    }

    public updateUserById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (Object.keys(req.body).includes("password")) {
            return next(createError(400, "Cannot change password"));
        }

        const userToUpdate = req.body;
        
        try {
            await this.validate.userId(req.params.userId);
            await this.userService.update(req.params.userId, userToUpdate);
            res.sendStatus(200);
        } catch (error) {
            return next(createError(500, error as any));
        }
    }

    public updateUserPasswordById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.params.userId ||
            !req.body.oldPassword ||
            !req.body.newPassword) {
            return next(createError(400, "Must provide old and new password"));
        }

        const user = await this.userService.get(
            req.params.userId,
            { hiddenFieldsToShow: ["password"] }
        );

        if (!user) {
            return next(createError(404, "User not found"));
        }

        const oldPasswordIsValid = bcrypt.compareSync(req.body.oldPassword, user.password);
        if (!oldPasswordIsValid) { return next(createError(401, "Unauthorized")); }

        try {
            const fieldsToUpdate = {
                password: bcrypt.hashSync(req.body.newPassword)
            };

            await this.userService.update(req.params.userId, fieldsToUpdate as any);
            res.send({
                userId: user.id
            });
        } catch (error) {
            return next(createError(500, "Something went wrong"));
        }
    }

    private formatUserProps(user: User) {
        user.first_name = toTitleCase(user.first_name);
        user.last_name = toTitleCase(user.last_name);

        delete user.created_at;
        delete user.updated_at;

        return toCamelCaseAllPropsKeys(user as ObjectLiteral);;
    }
}

export default UsersController;
