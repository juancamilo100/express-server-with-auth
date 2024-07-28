import express from "express";
import { usersController as controller } from "../controllers";
import { transformBodyPropsValuesToLowerCase } from "../middleware/body.transform.lowercase.middleware";
import { authorizeUserById } from "../middleware/userId.authorization.middleware";
import { decodeBase64BodyFields } from "../middleware/body.transform.decodeBase64.middleware";

const router = express.Router();

router.get("/",
    controller.getUsers
);
router.get("/:userId",
    authorizeUserById,
    controller.getUserById
);
router.patch("/:userId",
    [transformBodyPropsValuesToLowerCase, authorizeUserById],
    controller.updateUserById
);
router.patch("/:userId/password",
    [
        transformBodyPropsValuesToLowerCase, 
        authorizeUserById,
        decodeBase64BodyFields
    ],
    controller.updateUserPasswordById
);
router.delete("/:userId",
    authorizeUserById,
    controller.deleteUserById
);

export default router;
