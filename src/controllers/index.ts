import AuthController from "./auth.controller";
import UsersController from "./users.controller";

import { userService } from "../services";
import Validator from "../utils/validator";

const validator = new Validator(userService);

export const authController = new AuthController(userService, validator);
export const usersController = new UsersController(
	userService,
	validator
);
