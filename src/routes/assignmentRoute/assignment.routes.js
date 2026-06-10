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
router.get("/admin/assignments/countries", getCountryAssignmentsController);
router.post("/admin/assignments/country", validate(countryAssignmentSchema), assignCountryController);
router.delete("/admin/assignments/country", removeCountryAssignmentController);

// Institution assignments
router.get("/admin/assignments/institutions", getInstitutionAssignmentsController);
router.post("/admin/assignments/institution", validate(institutionAssignmentSchema), assignInstitutionController);
router.delete("/admin/assignments/institution", removeInstitutionAssignmentController);

export default router;
