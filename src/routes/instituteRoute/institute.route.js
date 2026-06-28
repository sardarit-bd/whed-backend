import express from "express";
import { createInstitute, getAllInstitutes, getInstituteByStateAndOrgID, getInstitutesByState } from '../../controllers/instituteController/institute.controller.js';
import { authorize, protect } from "../../middlewares/auth.middleware.js";
import { checkStateResponsibility } from "../../middlewares/responsibility.middleware.js";
import { instituteSchema, validate } from "../../validations/institution.validation.js";


const router = express.Router();


//all get route
router.get("/private/institutes", protect, getAllInstitutes);
router.get("/private/state/:stateId/institutes", protect, getInstitutesByState);
router.get("/private/state/:stateId/institute/:orgId", protect, getInstituteByStateAndOrgID);


//all post route
router.post("/private/state/:stateId/institute", protect, authorize(1, 0), checkStateResponsibility, validate(instituteSchema), createInstitute);


//all put route
// router.put("/private/state/:stateId/institute/:id", protect, authorize(1, 0), checkStateResponsibility, validate(updateInstituteSchema), updateInstitute);



//all delete route
// router.delete("/private/state/:stateId/institute/:id", protect, authorize(1, 0), checkStateResponsibility, deleteInstitute);






export default router;