import express from "express";
import { authController as controller } from "../controllers";
import { authenticateUser } from "../middleware/authentication.middleware";
import { transformBodyPropsValuesToLowerCase } from "../middleware/body.transform.lowercase.middleware";
import { decodeBase64BodyFields } from "../middleware/body.transform.decodeBase64.middleware";

const router = express.Router();

router.post("/login",
    [transformBodyPropsValuesToLowerCase, decodeBase64BodyFields],
    controller.loginUser
);
router.post("/register",
    [
        transformBodyPropsValuesToLowerCase, 
        decodeBase64BodyFields
    ],
    controller.registerUser
);

export default router;
