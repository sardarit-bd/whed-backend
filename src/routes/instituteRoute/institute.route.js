import express from "express";
import { createInstitute, createResearchJournalsForInstitute, DeleteResearchJournalsForInstitute, getAllInstitutes, getInstituteByStateAndOrgID, getInstitutesByCountryCode, getInstitutesByState, updateInstitute } from '../../controllers/instituteController/institute.controller.js';
import { authorize, protect } from "../../middlewares/auth.middleware.js";
import { checkStateResponsibility } from "../../middlewares/responsibility.middleware.js";
import { instituteSchema, ResearchJournalSchema, updateInstituteSchema, validate } from "../../validations/institution.validation.js";


const router = express.Router();


// public Route
router.get("/public/country/:countryCode/institutes", getInstitutesByCountryCode);
router.get("/public/state/:stateId/institute/:orgId", getInstituteByStateAndOrgID);





// private Route
//all get route
router.get("/private/institutes", protect, getAllInstitutes);
router.get("/private/state/:stateId/institutes", protect, getInstitutesByState);
router.get("/private/country/:countryCode/institutes", protect, getInstitutesByCountryCode);
router.get("/private/state/:stateId/institute/:orgId", protect, getInstituteByStateAndOrgID);



//all post route
router.post("/private/state/:stateId/institute", protect, authorize(1, 0), checkStateResponsibility, validate(instituteSchema), createInstitute);
router.post("/private/state/:stateId/institute/:orgId/researchJournals", protect, authorize(1, 0), checkStateResponsibility, validate(ResearchJournalSchema), createResearchJournalsForInstitute);


//all put route
router.put("/private/state/:stateId/institute/:orgId", protect, authorize(1, 0), checkStateResponsibility, validate(updateInstituteSchema), updateInstitute);



//all delete route
// router.delete("/private/state/:stateId/institute/:id", protect, authorize(1, 0), checkStateResponsibility, deleteInstitute@g87

router.delete("/private/state/:stateId/institute/:orgId/researchJournals/:journalId", protect, authorize(1, 0), checkStateResponsibility, DeleteResearchJournalsForInstitute);





export default router;