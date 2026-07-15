import express from "express";
import { addAgreement, addDecree, addExchangeprogram, addLanguage, addSchool, addStage, createStateSystem, createTypeOfHeis, editDecree, editSchool, getAgreementByStateID, getAllStateSystems, getEducationSystemByStateID, removeAgreement, removeDecree, removeExchangeProgram, removeLanguage, removeSchool, removeStage, removeTypeOfHeis, updateStage, updateStateSystem, updatetypeOfHeis } from "../../controllers/educationSystemController/educationSystem.controller.js";
import { authorize, protect } from "../../middlewares/auth.middleware.js";
import { checkStateResponsibility } from "../../middlewares/responsibility.middleware.js";
import { agreementSchama, exchangeProgram, languageSchama, preHeis, stageSchema, stateSystemSchema, typeOfHeis, updateDecreeSchema, updateStateSystemSchema, validate } from "../../validations/educationSystem.validation.js";

const router = express.Router();

//all get routes
router.get("/private/educationsystem", protect, authorize(0, 1), getAllStateSystems);
router.get("/private/state/:stateId/educationsystem", protect, authorize(0, 1), getEducationSystemByStateID);
router.get("/private/state/:stateId/educationsystem/agreement", protect, authorize(0, 1), getAgreementByStateID);




//all post routes
router.post("/private/state/:stateId/educationsystem", protect, authorize(1, 0), checkStateResponsibility, validate(stateSystemSchema), createStateSystem);
router.post("/private/state/:stateId/educationsystem/typeofhei", protect, authorize(1, 0), validate(typeOfHeis), checkStateResponsibility, createTypeOfHeis);
router.post("/private/state/:stateId/educationsystem/preheischool", protect, authorize(1, 0), checkStateResponsibility, validate(preHeis), addSchool);
router.post("/private/state/:stateId/educationsystem/agreement", protect, authorize(1, 0), checkStateResponsibility, validate(agreementSchama), addAgreement);
router.post("/private/state/:stateId/educationsystem/low", protect, authorize(1, 0), checkStateResponsibility, validate(updateDecreeSchema), addDecree);
router.post("/private/state/:stateId/educationsystem/language", protect, authorize(1, 0), checkStateResponsibility, validate(languageSchama), addLanguage);
router.post("/private/state/:stateId/educationsystem/stage", protect, authorize(1, 0), checkStateResponsibility, validate(stageSchema), addStage);
router.post("/private/state/:stateId/educationsystem/exchangeprogram", protect, authorize(1, 0), checkStateResponsibility, validate(exchangeProgram), addExchangeprogram);




// all put routes
router.put("/private/state/:stateId/educationsystem", protect, authorize(1, 0), checkStateResponsibility, validate(updateStateSystemSchema), updateStateSystem);
router.put("/private/state/:stateId/typeofhei/:id", protect, authorize(1, 0), checkStateResponsibility, validate(typeOfHeis), updatetypeOfHeis);
router.put("/private/state/:stateId/preheischool/:schoolId", protect, authorize(1, 0), checkStateResponsibility, validate(preHeis), editSchool);
router.put("/private/state/:stateId/educationsystem/low/:decreeID", protect, authorize(1, 0), checkStateResponsibility, validate(updateDecreeSchema), editDecree);
router.put("/private/state/:stateId/educationsystem/stage/:stageCode", protect, authorize(1, 0), checkStateResponsibility, validate(stageSchema), updateStage);



// all delete routes
router.delete("/private/state/:stateId/typeofhei/:id", protect, authorize(1, 0), checkStateResponsibility, removeTypeOfHeis);
router.delete("/private/state/:stateId/preheischool/:schoolId", protect, authorize(1, 0), checkStateResponsibility, removeSchool);
router.delete("/private/state/:stateId/educationsystem/agreement/:agreementId", protect, authorize(1, 0), checkStateResponsibility, removeAgreement);
router.delete("/private/state/:stateId/educationsystem/low/:decreeID", protect, authorize(1, 0), checkStateResponsibility, removeDecree);
router.delete("/private/state/:stateId/educationsystem/language/:languagecode", protect, authorize(1, 0), checkStateResponsibility, removeLanguage);
router.delete("/private/state/:stateId/educationsystem/stage/:stageCode", protect, authorize(1, 0), checkStateResponsibility, removeStage);
router.delete("/private/state/:stateId/educationsystem/exchangeprogram/:exchangeId", protect, authorize(1, 0), checkStateResponsibility, removeExchangeProgram);



export default router;
