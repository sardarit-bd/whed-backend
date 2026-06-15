import express from "express";
import { changePassword, forgotPassword, loginUser, logoutUser, registerUser, verifyOTP } from "../../controllers/authcontroller/auth.controller.js";
import { authorize, protect } from "../../middlewares/auth.middleware.js";
import { loginSchema, registerSchema, resetPassRequestSchema, resetPassSchema, validate } from "../../validations/auth.validation.js";

const router = express.Router();

router.post("/private/auth/register", protect, authorize(1), validate(registerSchema), registerUser);
router.post("/private/auth/login", validate(loginSchema), loginUser);
router.post("/private/auth/logout", protect, logoutUser);

router.post("/private/auth/forgot-password", validate(resetPassRequestSchema), forgotPassword);
router.post("/private/auth/verify-otp", validate(loginSchema), verifyOTP);
router.post("/private/auth/reset-password", validate(resetPassSchema), changePassword);


export default router;