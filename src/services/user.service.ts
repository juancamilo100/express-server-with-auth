import { EntitySchema, DataSource } from "typeorm";
import User from "../database/entities/user.entity";
import BaseDataService from "./base.data.service";

class UserService extends BaseDataService<User> {
    constructor(protected datasource: DataSource) {
        super({
            schema: User as unknown as EntitySchema<User>,
            alias: "users"
        }, datasource);
    }
}

export default UserService;
