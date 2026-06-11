import express from "express";
import { createMyState, createState, deleteMyState, deleteState, getAllStates, getMyStates, getSingleState, updateMyState, updateState } from '../../controllers/stateController/state.controller.js';
import { authorize, protect } from "../../middlewares/auth.middleware.js";
import { checkStateResponsibility } from "../../middlewares/responsibility.middleware.js";
import { logProfileHit } from "../../middlewares/stats.middleware.js";
import { stateSchema, updateStateSchema, validate } from "../../validations/state.validation.js";

const router = express.Router();

router.get("/states", protect, getAllStates);
router.get("/state/:id", protect, logProfileHit("State"), getSingleState);
router.post("/state", protect, authorize(1), validate(stateSchema), createState);
router.put("/state/:id", protect, checkStateResponsibility, authorize(1), validate(updateStateSchema), updateState);
router.delete("/state/:id", protect, checkStateResponsibility, authorize(1), deleteState);


// my update
router.get("/mystate", protect, authorize(1, 0), getMyStates);
router.post("/mystate", protect, authorize(1, 0), validate(stateSchema), createMyState);
router.put("/mystate/:id", protect, authorize(1, 0), checkStateResponsibility, validate(updateStateSchema), updateMyState);
router.delete("/mystate/:id", protect, authorize(1, 0), checkStateResponsibility, deleteMyState);


export default router;
