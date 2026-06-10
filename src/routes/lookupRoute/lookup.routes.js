import express from "express";
import {
  createFieldOfStudyController,
  createInstTypeController,
  createLanguageController,
  createStageController,
  deleteInstTypeController,
  getFieldsOfStudyController,
  getInstTypeByIdController,
  getInstTypesController,
  getLanguagesController,
  getStagesController,
  linkStateLanguageController,
  linkStateStageController,
  updateInstTypeController
} from "../../controllers/lookupController/lookup.controller.js";
import {
  fosSchema,
  instTypeSchema,
  languageSchema,
  stageSchema,
  stateLanguageLinkSchema,
  stateStageLinkSchema,
  updateInstTypeSchema,
  validate
} from "../../validations/lookup.validation.js";

const router = express.Router();

// Institution Types CRUD
router.get("/inst-types", getInstTypesController);
router.get("/inst-type/:id", getInstTypeByIdController);
router.post("/inst-type", validate(instTypeSchema), createInstTypeController);
router.put("/inst-type/:id", validate(updateInstTypeSchema), updateInstTypeController);
router.delete("/inst-type/:id", deleteInstTypeController);

// Languages
router.get("/languages", getLanguagesController);
router.post("/language", validate(languageSchema), createLanguageController);
router.post("/state/:stateId/languages", validate(stateLanguageLinkSchema), linkStateLanguageController);

// Stages
router.get("/stages", getStagesController);
router.post("/stage", validate(stageSchema), createStageController);
router.post("/state/:stateId/stages", validate(stateStageLinkSchema), linkStateStageController);

// Fields of Study
router.get("/fields-of-study", getFieldsOfStudyController);
router.post("/field-of-study", validate(fosSchema), createFieldOfStudyController);

export default router;
