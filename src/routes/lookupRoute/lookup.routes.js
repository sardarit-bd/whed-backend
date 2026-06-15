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
router.get("/private/inst-types", getInstTypesController);
router.get("/private/inst-type/:id", getInstTypeByIdController);
router.post("/private/inst-type", validate(instTypeSchema), createInstTypeController);
router.put("/private/inst-type/:id", validate(updateInstTypeSchema), updateInstTypeController);
router.delete("/private/inst-type/:id", deleteInstTypeController);

// Languages
router.get("/private/languages", getLanguagesController);
router.post("/private/language", validate(languageSchema), createLanguageController);
router.post("/private/state/:stateId/languages", validate(stateLanguageLinkSchema), linkStateLanguageController);

// Stages
router.get("/private/stages", getStagesController);
router.post("/private/stage", validate(stageSchema), createStageController);
router.post("/private/state/:stateId/stages", validate(stateStageLinkSchema), linkStateStageController);

// Fields of Study
router.get("/private/fields-of-study", getFieldsOfStudyController);
router.post("/private/field-of-study", validate(fosSchema), createFieldOfStudyController);

export default router;
