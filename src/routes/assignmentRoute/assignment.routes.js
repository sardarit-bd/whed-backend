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

// Only admin users can manage editorial workspace assignments
router.use(protect, authorize("admin"));

// Country assignments
router.get("/private/assignments/countries", getCountryAssignmentsController);
router.post("/private/assignments/country", validate(countryAssignmentSchema), assignCountryController);
router.delete("/private/assignments/country", removeCountryAssignmentController);

// Institution assignments
router.get("/private/assignments/institutions", getInstitutionAssignmentsController);
router.post("/private/assignments/institution", validate(institutionAssignmentSchema), assignInstitutionController);
router.delete("/private/assignments/institution", removeInstitutionAssignmentController);

export default router;
