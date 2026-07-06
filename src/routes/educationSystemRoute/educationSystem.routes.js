import express from "express";
import { createStateSystem, getAllStateSystems, getEducationSystemByStateID, removeEducationsystem, updateStateSystem } from "../../controllers/educationSystemController/educationSystem.controller.js";
import { authorize, protect } from "../../middlewares/auth.middleware.js";
import { checkStateResponsibility } from "../../middlewares/responsibility.middleware.js";
import { stateSystemSchema, updateStateSystemSchema, validate } from "../../validations/educationSystem.validation.js";

const router = express.Router();

//all get routes
router.get("/private/educationsystem", protect, authorize(0, 1), getAllStateSystems);
router.get("/private/state/:stateId/educationsystem", protect, authorize(0, 1), getEducationSystemByStateID);





//all post routes
router.post("/private/state/:stateId/educationsystem", protect, authorize(1, 0), checkStateResponsibility, validate(stateSystemSchema), createStateSystem);
router.post("/private/state/:stateId/educationsystem/typeofhei", protect, authorize(1, 0), checkStateResponsibility, createStateSystem);





// all put routes
router.put("/private/state/:stateId/educationsystem", protect, authorize(1, 0), checkStateResponsibility, validate(updateStateSystemSchema), updateStateSystem);



// all delete routes
router.delete("/private/state/:stateId/educationsystem", protect, authorize(1, 0), checkStateResponsibility, removeEducationsystem);



export default router;
