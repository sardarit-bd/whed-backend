import express from "express";
import { adminDeshboard, myDeshboard } from "../../controllers/adminController/admin.controller.js";
import { authorize, protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/deshboard", protect, authorize("admin"), adminDeshboard);
router.get("/my-deshboard", protect, authorize("user", "admin"), myDeshboard);


export default router;