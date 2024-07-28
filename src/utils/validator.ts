import IDataService from '../interfaces/data.service.interface';
import User from '../database/entities/user.entity';

export default class Validator {
    constructor(
        private userService: IDataService<User>) {}

    public async userId(userId: string) {
        const userFound =  await this.userService.get(userId);
            
        if (!userFound) {
            throw new Error(`User with ID: ${userId} was not found`);
        }

        return userFound;
    }

    public async userExists(email: string) {
        const userFound = await this.userService.getByFields({ email });
        if(!!userFound) {
            throw new Error("User already exists");
        }
    }

    public isEmail(email: string) {
        const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!emailRegex.test(email)) {
            throw new Error("Email is not valid");
        }
    }

    public async userCustomerRelation(customerId: number, userId: number) {
        const user = await this.userService.getByFields({
            customer_id: customerId,
            id: userId
        });
        if (!user) {
            throw new Error(`User with ID: ${userId} does not work for customer with ID: ${customerId}`);
        }
    }

    public userJobTitle(title: string) {
        const maxTitleLength = 30;
        if(title.length > maxTitleLength) {
            throw new Error(`Job title exceeds ${maxTitleLength} characters`);
        }
    }
}