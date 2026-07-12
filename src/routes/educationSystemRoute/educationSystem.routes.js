import express from "express";
import { addSchool, createStateSystem, createTypeOfHeis, editSchool, getAllStateSystems, getEducationSystemByStateID, removeSchool, removeTypeOfHeis, updatetypeOfHeis } from "../../controllers/educationSystemController/educationSystem.controller.js";
import { authorize, protect } from "../../middlewares/auth.middleware.js";
import { checkStateResponsibility } from "../../middlewares/responsibility.middleware.js";
import { preHeis, stateSystemSchema, typeOfHeis, updateStateSystemSchema, validate } from "../../validations/educationSystem.validation.js";

const router = express.Router();

//all get routes
router.get("/private/educationsystem", protect, authorize(0, 1), getAllStateSystems);
router.get("/private/state/:stateId/educationsystem", protect, authorize(0, 1), getEducationSystemByStateID);




//all post routes
router.post("/private/state/:stateId/educationsystem", protect, authorize(1, 0), checkStateResponsibility, validate(stateSystemSchema), createStateSystem);
router.post("/private/state/:stateId/educationsystem/typeofhei", protect, authorize(1, 0), validate(typeOfHeis), checkStateResponsibility, createTypeOfHeis);
router.post("/private/state/:stateId/educationsystem/preheischool", protect, authorize(1, 0), checkStateResponsibility, validate(preHeis), addSchool);




// all put routes
router.put("/private/state/:stateId/educationsystem", protect, authorize(1, 0), checkStateResponsibility, validate(updateStateSystemSchema), createStateSystem);
router.put("/private/state/:stateId/typeofhei/:id", protect, authorize(1, 0), checkStateResponsibility, validate(typeOfHeis), updatetypeOfHeis);
router.put("/private/state/:stateId/preheischool/:schoolId", protect, authorize(1, 0), checkStateResponsibility, validate(preHeis), editSchool);



// all delete routes
router.delete("/private/state/:stateId/typeofhei/:id", protect, authorize(1, 0), checkStateResponsibility, removeTypeOfHeis);
router.delete("/private/state/:stateId/preheischool/:schoolId", protect, authorize(1, 0), checkStateResponsibility, removeSchool);



export default router;
