import express from "express";
import { getCountriesWithResionaAndStates, getEducationalSystemAndCredientialDetailesByStateID, getEducationSystemAndCredientialListByCountryCode, getInstituteByStateAndOrgID, getInstitutesByStateID } from './../../controllers/publicController/public.controller.js';


const router = express.Router();



router.get("/countrys", getCountriesWithResionaAndStates);
router.get("/state/:stateId/institutes", getInstitutesByStateID);
router.get("/state/:stateId/institute/:orgId", getInstituteByStateAndOrgID);
router.get("/country/:countryCode/edusystemandcredentailslist", getEducationSystemAndCredientialListByCountryCode);
router.get("/state/:stateId/edusystemandcredentailsDetailes", getEducationalSystemAndCredientialDetailesByStateID);


export default router;