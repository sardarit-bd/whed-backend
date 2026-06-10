import express from "express";
import {
  addDecree,
  addSchool,
  createStateSystem,
  deleteStateSystem,
  editDecree,
  editSchool,
  getAllStateSystems,
  getDecrees,
  getSchools,
  getStateSystemDetails,
  removeDecree,
  removeSchool,
  updateStateSystem
} from "../../controllers/stateSystemController/stateSystem.controller.js";
import {
  decreeSchema,
  schoolSchema,
  stateSystemSchema,
  updateDecreeSchema,
  updateSchoolSchema,
  updateStateSystemSchema,
  validate
} from "../../validations/stateSystem.validation.js";

const router = express.Router();

router.get("/statesystems", getAllStateSystems);
router.get("/statesystem/:stateId", getStateSystemDetails);
router.post("/statesystem", validate(stateSystemSchema), createStateSystem);
router.put("/statesystem/:stateId", validate(updateStateSystemSchema), updateStateSystem);
router.delete("/statesystem/:stateId", deleteStateSystem);

// Schools
router.get("/statesystem/:stateId/schools", getSchools);
router.post("/statesystem/:stateId/school", validate(schoolSchema), addSchool);
router.put("/statesystem/:stateId/school/:levelCode", validate(updateSchoolSchema), editSchool);
router.delete("/statesystem/:stateId/school/:levelCode", removeSchool);

// Decrees
router.get("/statesystem/:stateId/decrees", getDecrees);
router.post("/statesystem/:stateId/decree", validate(decreeSchema), addDecree);
router.put("/statesystem/:stateId/decree/:decreeId", validate(updateDecreeSchema), editDecree);
router.delete("/statesystem/:stateId/decree/:decreeId", removeDecree);

export default router;
