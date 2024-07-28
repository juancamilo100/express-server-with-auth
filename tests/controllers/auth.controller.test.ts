import AuthController from '../../src/controllers/auth.controller'
import {userService} from '../../src/services'
import bcrypt from "bcryptjs";
import Validator from '../../src/utils/validator';


describe("Auth Controller", () => {  
    let authController: AuthController;
    
    beforeAll(() => {
        const validator = new Validator(
            userService
        );
        
        authController = new AuthController(userService, validator);
    })

    beforeEach(() => {
        jest.resetAllMocks();
    })
    
    describe("Login", () => {
        it("logs in the user", async () => {
            userService.getByFields = jest.fn().mockImplementation((id: string) => {
                return {
                    password: bcrypt.hashSync("somepassword")
                };
            });
            
            const nextFunction = jest.fn();

            const req: any = {
                body: {
                    email: "someemail@email.com",
                    password: "somepassword"
                }
            };
    
            let res: any = {
                send: jest.fn()
            };
            
            await authController.loginUser(req, res, nextFunction);
            expect(res.send).toHaveBeenCalled();
        });

        it("Throws error when user is not found", async () => {
            userService.getByFields = jest.fn().mockImplementation((id: string) => null);
            const nextFunction = jest.fn();

            const req: any = {
                body: {
                    username: "someuser",
                    password: "somepassword"
                }
            };
    
            const res: any = {
                send: jest.fn()
            };

            await authController.loginUser(req, res, nextFunction);
            expect(nextFunction).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledTimes(0);
        });

        it("Throws error when password is invalid", async () => { 
            userService.getByFields = jest.fn().mockImplementation((id: string) => {
                return {
                    password: bcrypt.hashSync("wrongpassword")
                };
            });

            const nextFunction = jest.fn();

            const req: any = {
                body: {
                    username: "someuser",
                    password: "somepassword"
                }
            };
    
            let res: any = {
                send: jest.fn()
            };
            
            await authController.loginUser(req, res, nextFunction);
            expect(nextFunction).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledTimes(0);
        });

        it("Throws error when email is invalid", async () => { 
            const nextFunction = jest.fn();
            userService.getByFields = jest.fn().mockImplementation((id: string) => {
                return {
                    password: bcrypt.hashSync("somepassword")
                };
            });

            const req: any = {
                body: {
                    email: "someemail",
                    password: "somepassword"
                }
            };
    
            let res: any = {
                send: jest.fn()
            };
            
            await authController.loginUser(req, res, nextFunction);
            expect(nextFunction).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledTimes(0);
        });
    });

    describe("Registration", () => { 
        it("registers the user", async () => { 
            userService.getByEitherFields = jest.fn().mockImplementation((id: string) => null);
            userService.create = jest.fn();

            const nextFunction = jest.fn();

            const req: any = {
                body: {
                    firstName: "someName",
                    lastName: "someLastName",
                    jobTitle: "someTitle",
                    companyId: "companyId",
                    password: "somepassword",
                    email: "someemail@email.com",
                    userRate: 12,
                    customerRate: 19,
                    customerId: 1234
                }
            };
    
            let res: any = {
                send: jest.fn()
            };
            
            await authController.registerUser(req, res, nextFunction);
            expect(userService.create).toHaveBeenCalled();
        });

        it("throws error when email or password is missing", async () => { 
            userService.getByEitherFields = jest.fn().mockImplementation((id: string) => null);
            userService.create = jest.fn();
            const nextFunction = jest.fn();

            let req: any = {
                body: {
                    email: "someemail@email.com"
                }
            };

            let res: any = {
                send: jest.fn()
            };

            await authController.registerUser(req, res, nextFunction);
            expect(nextFunction).toHaveBeenCalled();

            req = {
                body: {
                    password: "somepassword",
                }
            };

            await authController.registerUser(req, res, nextFunction);
            expect(nextFunction).toHaveBeenCalled();
            expect(userService.create).toHaveBeenCalledTimes(0);
        });

        it("throws error when email is invalid", async () => { 
            userService.getByEitherFields = jest.fn().mockImplementation((id: string) => null);
            userService.create = jest.fn();
            const nextFunction = jest.fn();

            const req: any = {
                body: {
                    firstName: "someName",
                    lastName: "someLastName",
                    companyId: "companyId",
                    password: "somepassword",
                    email: "invalidemail",
                    userRate: 12,
                    customerRate: 19,
                    customerId: 1234
                }
            };

            let res: any = {
                send: jest.fn()
            };

            await authController.registerUser(req, res, nextFunction);
            expect(nextFunction).toHaveBeenCalled();
            expect(userService.create).toHaveBeenCalledTimes(0);
        });

        it("throws error if user already exists", async () => { 
            userService.getByEitherFields = jest.fn().mockImplementation((id: string) => {
                return { 
                    firstName: "exisitingName",
                    lastName: "exisitingLastName",
                    companyId: "companyId",
                    password: "somepassword",
                    email: "someemail@email.com"
                }
            });
            userService.create = jest.fn();

            const nextFunction = jest.fn();

            let req: any = {
                body: {
                    password: "somepassword",
                    email: "someemail@email.com"
                }
            };

            let res: any = {
                send: jest.fn()
            };

            await authController.registerUser(req, res, nextFunction);
            expect(nextFunction).toHaveBeenCalled();
            expect(userService.create).toHaveBeenCalledTimes(0);
        });
    })
});