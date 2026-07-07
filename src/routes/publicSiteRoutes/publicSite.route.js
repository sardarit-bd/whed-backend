import express from "express";
import { getCountriesWithResionaAndStates, getInstituteByStateAndOrgID, getInstitutesByStateID } from './../../controllers/publicController/public.controller.js';


const router = express.Router();



router.get("/countrys", getCountriesWithResionaAndStates);
router.get("/state/:stateId/institutes", getInstitutesByStateID);
router.get("/state/:stateId/institute/:orgId", getInstituteByStateAndOrgID);




export default router;