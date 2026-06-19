import express from "express";
import {
  assignCountryController,
  assignInstitutionController,
  getCountryAssignmentsController,
  getInstitutionAssignmentsController,
  removeCountryAssignmentController,
  removeInstitutionAssignmentController
} from "../../controllers/assignmentController/assignment.controller.js";
import { authorize, protect } from "../../middlewares/auth.middleware.js";
import {
  countryAssignmentSchema,
  institutionAssignmentSchema,
  validate
} from "../../validations/assignment.validation.js";

const router = express.Router();


// Country assignments
router.get("/private/assignments/countries", protect, authorize(1), getCountryAssignmentsController);
router.post("/private/assignments/country", protect, authorize(1), validate(countryAssignmentSchema), assignCountryController);
router.delete("/private/assignments/country", protect, authorize(1), removeCountryAssignmentController);

// Institution assignments
router.get("/private/assignments/institutions", protect, authorize(1), getInstitutionAssignmentsController);
router.post("/private/assignments/institution", protect, authorize(1), validate(institutionAssignmentSchema), assignInstitutionController);
router.delete("/private/assignments/institution", protect, authorize(1), removeInstitutionAssignmentController);

export default router;
