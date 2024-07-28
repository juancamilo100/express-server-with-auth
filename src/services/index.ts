import databaseManager from "../database/databaseManager";
import UserService from "./user.service";

export const userService = new UserService(databaseManager.dataSource);