import express from "express";
import { createState, deleteState, getAllStates, getSingleState, updateState } from '../../controllers/stateController/state.controller.js';
import { stateSchema, updateStateSchema, validate } from "../../validations/state.validation.js";
import { logProfileHit } from "../../middlewares/stats.middleware.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { checkStateResponsibility } from "../../middlewares/responsibility.middleware.js";

const router = express.Router();

router.get("/states", getAllStates);
router.get("/state/:id", logProfileHit("State"), getSingleState);
router.post("/state", protect, validate(stateSchema), createState);
router.put("/state/:id", protect, checkStateResponsibility, validate(updateStateSchema), updateState);
router.delete("/state/:id", protect, checkStateResponsibility, deleteState);

export default router;
