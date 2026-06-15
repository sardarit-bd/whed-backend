import express from "express";
import { getAllUsers, getUser, updateUser,deleteUser } from '../../controllers/userController/user.controller.js';
import { updateUserSchema, validate } from "../../validations/user.validation.js";


const router = express.Router();



router.get("/private/users", getAllUsers);
router.get("/private/user/:id", getUser);
router.put("/private/user/:id", validate(updateUserSchema), updateUser);
router.delete("/private/user/:id", deleteUser);

export default router;