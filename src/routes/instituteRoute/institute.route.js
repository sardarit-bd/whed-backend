import express from "express";
import { createInstitute, deleteInstitute, getAllInstitutes, getSingleInstitute, getInstitutesByState, updateInstitute } from '../../controllers/instituteController/institute.controller.js';
import { protect } from "../../middlewares/auth.middleware.js";
import { checkStateResponsibility } from "../../middlewares/responsibility.middleware.js";
import { logProfileHit } from "../../middlewares/stats.middleware.js";
import { instituteSchema, updateInstituteSchema, validate } from "../../validations/institution.validation.js";


const router = express.Router();


router.get("/institutes", getAllInstitutes);
router.get("/institutes/state/:stateId", getInstitutesByState);

router.get("/institute/:id", logProfileHit("Institute"), getSingleInstitute);

router.post("/institute", protect, checkStateResponsibility, validate(instituteSchema), createInstitute);

router.put("/institute/:id", protect, checkStateResponsibility, validate(updateInstituteSchema), updateInstitute);

router.delete("/institute/:id", protect, checkStateResponsibility, deleteInstitute);



export default router;