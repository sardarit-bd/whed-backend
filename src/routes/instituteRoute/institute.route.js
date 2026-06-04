import express from "express";
import { createInstitute, deleteInstitute, getAllInstitutes, getSingleInstitute, updateInstitute } from '../../controllers/instituteController/institute.controller.js';
import { authorize, protect } from "../../middlewares/auth.middleware.js";


const router = express.Router();



router.get("/institutes", getAllInstitutes);

router.get("/institutes/:id", getSingleInstitute);

router.post("/institutes", protect, authorize("admin"), createInstitute);

router.put("/institutes/:id", protect, authorize("admin"), updateInstitute);

router.delete("/institutes/:id", protect, authorize("admin"), deleteInstitute);



export default router;