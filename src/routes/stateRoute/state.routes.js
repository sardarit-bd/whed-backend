import express from "express";
import { createState, deleteState, getAllStates, getMyStates, getSingleState, getStatisticsByStateID, updateState } from '../../controllers/stateController/state.controller.js';
import { authorize, protect } from "../../middlewares/auth.middleware.js";
import { checkStateResponsibility } from "../../middlewares/responsibility.middleware.js";
import { stateSchema, updateStateSchema, validate } from "../../validations/state.validation.js";

const router = express.Router();


// all get routes
router.get("/private/states", protect, getAllStates);
router.get("/private/state/my", protect, getMyStates);
router.get("/private/state/:stateId", protect, getSingleState);
router.get("/private/state/:stateId/statistics", protect, getStatisticsByStateID);


//all post routes,
router.post("/private/state", protect, authorize(1), validate(stateSchema), createState);


// all update routes4
router.put("/private/state/:stateId", protect, authorize(1), checkStateResponsibility, validate(updateStateSchema), updateState);



// all delete routes
router.delete("/private/state/:stateId", protect, authorize(1), deleteState);



export default router;
