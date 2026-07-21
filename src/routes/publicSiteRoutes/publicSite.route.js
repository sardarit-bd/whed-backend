import express from "express";
import { getCredentialsByStateId } from "../../controllers/credentialController/credential.controller.js";
import { getEducationSystemByStateID } from "../../controllers/educationSystemController/educationSystem.controller.js";
import { getSingleState } from "../../controllers/stateController/state.controller.js";
import { getCountriesWithResionaAndStates, getEducationalSystemAndCredientialDetailesByStateID, getEducationSystemAndCredientialListByCountryCode, getInstituteByStateAndOrgID, getInstitutesByStateID } from './../../controllers/publicController/public.controller.js';


const router = express.Router();



router.get("/countrys", getCountriesWithResionaAndStates);
router.get("/state/:stateId/institutes", getInstitutesByStateID);
router.get("/state/:stateId/institute/:orgId", getInstituteByStateAndOrgID);
router.get("/country/:countryCode/edusystemandcredentailslist", getEducationSystemAndCredientialListByCountryCode);
router.get("/state/:stateId/edusystemandcredentailsDetailes", getEducationalSystemAndCredientialDetailesByStateID);


router.get("/state/:stateId", getSingleState);
router.get("/state/:stateId/educationsystem", getEducationSystemByStateID);
router.get("/state/:stateId/credentials", getCredentialsByStateId);



export default router;