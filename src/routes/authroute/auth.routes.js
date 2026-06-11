import express from "express";
import { changePassword, forgotPassword, loginUser, logoutUser, registerUser, verifyOTP } from "../../controllers/authcontroller/auth.controller.js";
import { loginSchema, registerSchema, resetPassRequestSchema, resetPassSchema, validate } from "../../validations/auth.validation.js";
import { authorize, protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/private/auth/register", protect, authorize("1"), validate(registerSchema), registerUser);
router.post("/auth/login", validate(loginSchema), loginUser);
router.post("/auth/logout", protect, logoutUser);

router.post("/auth/forgot-password", validate(resetPassRequestSchema), forgotPassword);
router.post("/auth/verify-otp", validate(loginSchema), verifyOTP);
router.post("/auth/reset-password", validate(resetPassSchema), changePassword);


export default router;