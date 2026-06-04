import express from "express";
import { changePassword, forgotPassword, loginUser, logoutUser, registerUser, verifyOTP } from "../../controllers/authcontroller/authuserController.js";


const router = express.Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/logout", logoutUser);

router.post("/auth/forgot-password", forgotPassword);
router.post("/auth/verify-otp", verifyOTP);
router.post("/auth/reset-password", changePassword);


export default router;