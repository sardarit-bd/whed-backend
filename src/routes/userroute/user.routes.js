import express from "express";
import { getAllUsers, getUser, updateUser } from '../../controllers/userController/user.controller.js';
import { updateUserSchema, validate } from "../../validations/user.validation.js";


const router = express.Router();



router.get("/users", getAllUsers);
router.get("/user/:id", getUser);

router.put("/user/:id", validate(updateUserSchema), updateUser);



export default router;