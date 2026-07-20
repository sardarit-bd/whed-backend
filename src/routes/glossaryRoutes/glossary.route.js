import express from "express";
import {
  createCountry,
  createCredentialCategory,
  createCredentialLevel,
  createCurrency,
  createDivisionType,
  createFieldOfStudy,
  createInstitutionClass,
  createInstitutionFundingSource,
  createJobFunction,
  createLanguage,
  createMessage,
  createOrgType,
  createRegion,
  createReligion,
  createSchoolLevel,
  createStage,
  createStatus,
  deleteCountry,
  deleteCredentialCategory,
  deleteCredentialLevel,
  deleteCurrency,
  deleteDivisionType,
  deleteFieldOfStudy,
  deleteInstitutionClass,
  deleteInstitutionFundingSource,
  deleteJobFunction,
  deleteLanguage,
  deleteMessage,
  deleteOrgType,
  deleteRegion,
  deleteReligion,
  deleteSchoolLevel,
  deleteStage,
  deleteStatus,
  getAllCountries,
  getAllCredentialCategories,
  getAllCredentialLevels,
  getAllCurrencies,
  getAllDivisionTypes,
  getAllFieldsOfStudy,
  getAllGenres,
  getAllInstitutionClasses,
  getAllInstitutionFundingSources,
  getAllJobFunctions,
  getAllLanguages,
  getAllMembers,
  getAllMessages,
  getAllMonths,
  getAllOrgTypes,
  getAllRegions,
  getAllReligions,
  getAllSchoolLevels,
  getAllStages,
  getAllStatuses,
  getAllTcsIntTypes,
  getAllTcsIntTypesByStateId,
  getAllYesNo,
  getSingleCountry,
  getSingleCredentialCategory,
  getSingleCredentialLevel,
  getSingleCurrency,
  getSingleDivisionType,
  getSingleFieldOfStudy,
  getSingleInstitutionClass,
  getSingleInstitutionFundingSource,
  getSingleJobFunction,
  getSingleLanguage,
  getSingleMessage,
  getSingleOrgType,
  getSingleRegion,
  getSingleReligion,
  getSingleSchoolLevel,
  getSingleStage,
  getSingleStatus,
  updateCountry,
  updateCredentialCategory,
  updateCredentialLevel,
  updateCurrency,
  updateDivisionType,
  updateFieldOfStudy,
  updateInstitutionClass,
  updateInstitutionFundingSource,
  updateJobFunction,
  updateLanguage,
  updateMessage,
  updateOrgType,
  updateRegion,
  updateReligion,
  updateSchoolLevel,
  updateStage,
  updateStatus
} from "../../controllers/glossaryController/glossary.controller.js";
import { authorize, protect } from "../../middlewares/auth.middleware.js";
import {
  countrySchema,
  credCatSchema,
  credLevelSchema,
  currencySchema,
  divisionTypeSchema,
  fosSchema,
  instClassSchema,
  instFundingTypeSchema,
  jobFunctionSchema,
  languageSchema,
  orgTypeSchema,
  regionSchema,
  religionSchema,
  schoolLevelSchema,
  stageSchema,
  statusSchema,
  traductionSchema,
  updateCountrySchema,
  updateCredCatSchema,
  updateCredLevelSchema,
  updateCurrencySchema,
  updateDivisionTypeSchema,
  updateFosSchema,
  updateInstClassSchema,
  updateInstFundingTypeSchema,
  updateJobFunctionSchema,
  updateLanguageSchema,
  updateOrgTypeSchema,
  updateRegionSchema,
  updateReligionSchema,
  updateSchoolLevelSchema,
  updateStageSchema,
  updateStatusSchema,
  updateTraductionSchema,
  validate,
} from "../../validations/glossary.validation.js";

const router = express.Router();



//private routes for glossary management
// Countries
router.get("/private/glossary/countrys", getAllCountries);
router.get("/private/glossary/country/:id", getSingleCountry);
router.post("/private/glossary/country", protect, authorize(1), validate(countrySchema), createCountry);
router.put("/private/glossary/country/:id", protect, authorize(1), validate(updateCountrySchema), updateCountry);
router.delete("/private/glossary/country/:id", protect, authorize(1), deleteCountry);

// Credential Category
router.get("/private/glossary/credential-categorys", getAllCredentialCategories);
router.get("/private/glossary/credential-category/:id", getSingleCredentialCategory);
router.post("/private/glossary/credential-category", protect, authorize(1), validate(credCatSchema), createCredentialCategory);
router.put("/private/glossary/credential-category/:id", protect, authorize(1), validate(updateCredCatSchema), updateCredentialCategory);
router.delete("/private/glossary/credential-category/:id", protect, authorize(1), deleteCredentialCategory);

// Credential Level
router.get("/private/glossary/credential-levels", getAllCredentialLevels);
router.get("/private/glossary/credential-level/:id", getSingleCredentialLevel);
router.post("/private/glossary/credential-level", protect, authorize(1), validate(credLevelSchema), createCredentialLevel);
router.put("/private/glossary/credential-level/:id", protect, authorize(1), validate(updateCredLevelSchema), updateCredentialLevel);
router.delete("/private/glossary/credential-level/:id", protect, authorize(1), deleteCredentialLevel);

// Currency
router.get("/private/glossary/currencies", getAllCurrencies);
router.get("/private/glossary/currency/:id", getSingleCurrency);
router.post("/private/glossary/currency", protect, authorize(1), validate(currencySchema), createCurrency);
router.put("/private/glossary/currency/:id", protect, authorize(1), validate(updateCurrencySchema), updateCurrency);
router.delete("/private/glossary/currency/:id", protect, authorize(1), deleteCurrency);

// Division Type
router.get("/private/glossary/division-types", getAllDivisionTypes);
router.get("/private/glossary/division-type/:id", getSingleDivisionType);
router.post("/private/glossary/division-type", protect, authorize(1), validate(divisionTypeSchema), createDivisionType);
router.put("/private/glossary/division-type/:id", protect, authorize(1), validate(updateDivisionTypeSchema), updateDivisionType);
router.delete("/private/glossary/division-type/:id", protect, authorize(1), deleteDivisionType);

// Fields of Study
router.get("/private/glossary/fields-of-study", getAllFieldsOfStudy);
router.get("/private/glossary/fields-of-study/:id", getSingleFieldOfStudy);
router.post("/private/glossary/fields-of-study", protect, authorize(1), validate(fosSchema), createFieldOfStudy);
router.put("/private/glossary/fields-of-study/:id", protect, authorize(1), validate(updateFosSchema), updateFieldOfStudy);
router.delete("/private/glossary/fields-of-study/:id", protect, authorize(1), deleteFieldOfStudy);

// Institution Classes
router.get("/private/glossary/institution-classes", getAllInstitutionClasses);
router.get("/private/glossary/institution-class/:id", getSingleInstitutionClass);
router.post("/private/glossary/institution-class", protect, authorize(1), validate(instClassSchema), createInstitutionClass);
router.put("/private/glossary/institution-class/:id", protect, authorize(1), validate(updateInstClassSchema), updateInstitutionClass);
router.delete("/private/glossary/institution-class/:id", protect, authorize(1), deleteInstitutionClass);

// Institution Funding Sources
router.get("/private/glossary/institution-funding-sources", getAllInstitutionFundingSources);
router.get("/private/glossary/institution-funding-source/:id", getSingleInstitutionFundingSource);
router.post("/private/glossary/institution-funding-source", protect, authorize(1), validate(instFundingTypeSchema), createInstitutionFundingSource);
router.put("/private/glossary/institution-funding-source/:id", protect, authorize(1), validate(updateInstFundingTypeSchema), updateInstitutionFundingSource);
router.delete("/private/glossary/institution-funding-source/:id", protect, authorize(1), deleteInstitutionFundingSource);

// Job Function
router.get("/private/glossary/job-functions", getAllJobFunctions);
router.get("/private/glossary/job-function/:id", getSingleJobFunction);
router.post("/private/glossary/job-function", protect, authorize(1), validate(jobFunctionSchema), createJobFunction);
router.put("/private/glossary/job-function/:id", protect, authorize(1), validate(updateJobFunctionSchema), updateJobFunction);
router.delete("/private/glossary/job-function/:id", protect, authorize(1), deleteJobFunction);

// Language
router.get("/private/glossary/language-of-instructions", getAllLanguages);
router.get("/private/glossary/language-of-instruction/:id", getSingleLanguage);
router.post("/private/glossary/language-of-instruction", protect, authorize(1), validate(languageSchema), createLanguage);
router.put("/private/glossary/language-of-instruction/:id", protect, authorize(1), validate(updateLanguageSchema), updateLanguage);
router.delete("/private/glossary/language-of-instruction/:id", protect, authorize(1), deleteLanguage);

// Messages
router.get("/private/glossary/messages", getAllMessages);
router.get("/private/glossary/message/:id", getSingleMessage);
router.post("/private/glossary/message", protect, authorize(1), validate(traductionSchema), createMessage);
router.put("/private/glossary/message/:id", protect, authorize(1), validate(updateTraductionSchema), updateMessage);
router.delete("/private/glossary/message/:id", protect, authorize(1), deleteMessage);

// Regions
router.get("/private/glossary/regions", getAllRegions);
router.get("/private/glossary/region/:id", getSingleRegion);
router.post("/private/glossary/region", protect, authorize(1), validate(regionSchema), createRegion);
router.put("/private/glossary/region/:id", protect, authorize(1), validate(updateRegionSchema), updateRegion);
router.delete("/private/glossary/region/:id", protect, authorize(1), deleteRegion);

// Religions
router.get("/private/glossary/religions", getAllReligions);
router.get("/private/glossary/religion/:id", getSingleReligion);
router.post("/private/glossary/religion", protect, authorize(1), validate(religionSchema), createReligion);
router.put("/private/glossary/religion/:id", protect, authorize(1), validate(updateReligionSchema), updateReligion);
router.delete("/private/glossary/religion/:id", protect, authorize(1), deleteReligion);

// School Levels
router.get("/private/glossary/school-levels", getAllSchoolLevels);
router.get("/private/glossary/school-level/:id", getSingleSchoolLevel);
router.post("/private/glossary/school-level", protect, authorize(1), validate(schoolLevelSchema), createSchoolLevel);
router.put("/private/glossary/school-level/:id", protect, authorize(1), validate(updateSchoolLevelSchema), updateSchoolLevel);
router.delete("/private/glossary/school-level/:id", protect, authorize(1), deleteSchoolLevel);

// Stages
router.get("/private/glossary/stages", getAllStages);
router.get("/private/glossary/stage/:id", getSingleStage);
router.post("/private/glossary/stage", protect, authorize(1), validate(stageSchema), createStage);
router.put("/private/glossary/stage/:id", protect, authorize(1), validate(updateStageSchema), updateStage);
router.delete("/private/glossary/stage/:id", protect, authorize(1), deleteStage);

// Statuses
router.get("/private/glossary/statuses", getAllStatuses);
router.get("/private/glossary/status/:id", getSingleStatus);
router.post("/private/glossary/status", protect, authorize(1), validate(statusSchema), createStatus);
router.put("/private/glossary/status/:id", protect, authorize(1), validate(updateStatusSchema), updateStatus);
router.delete("/private/glossary/status/:id", protect, authorize(1), deleteStatus);

// Org Types
router.get("/private/glossary/org-types", getAllOrgTypes);
router.get("/private/glossary/org-type/:id", getSingleOrgType);
router.post("/private/glossary/org-type", protect, authorize(1), validate(orgTypeSchema), createOrgType);
router.put("/private/glossary/org-type/:id", protect, authorize(1), validate(updateOrgTypeSchema), updateOrgType);
router.delete("/private/glossary/org-type/:id", protect, authorize(1), deleteOrgType);



//whed_lex_yesno
router.get("/private/glossary/yesnos", getAllYesNo);

//whed_lex_genre
router.get("/private/glossary/genres", getAllGenres);

//whed_lex-member
router.get("/private/glossary/members", getAllMembers);

//whed_lex_month
router.get("/private/glossary/months", getAllMonths);





// whed_tcsinttype
router.get("/private/glossary/tcsinttypes", getAllTcsIntTypes);
router.get("/private/glossary/tcsinttypes/state/:stateId", getAllTcsIntTypesByStateId);


export default router;