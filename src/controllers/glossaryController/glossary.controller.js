import {
  createCountry as createCountryService,
  createCredentialCategory as createCredentialCategoryService,
  createCredentialLevel as createCredentialLevelService,
  createCurrency as createCurrencyService,
  createDivisionType as createDivisionTypeService,
  createFieldOfStudy as createFieldOfStudyService,
  createInstitutionClass as createInstitutionClassService,
  createInstitutionFundingSource as createInstitutionFundingSourceService,
  createJobFunction as createJobFunctionService,
  createLanguage as createLanguageService,
  createMessage as createMessageService,
  createOrgType as createOrgTypeService,
  createRegion as createRegionService,
  createReligion as createReligionService,
  createSchoolLevel as createSchoolLevelService,
  createStage as createStageService,
  createStatus as createStatusService,
  deleteCountry as deleteCountryService,
  deleteCredentialCategory as deleteCredentialCategoryService,
  deleteCredentialLevel as deleteCredentialLevelService,
  deleteCurrency as deleteCurrencyService,
  deleteDivisionType as deleteDivisionTypeService,
  deleteFieldOfStudy as deleteFieldOfStudyService,
  deleteInstitutionClass as deleteInstitutionClassService,
  deleteInstitutionFundingSource as deleteInstitutionFundingSourceService,
  deleteJobFunction as deleteJobFunctionService,
  deleteLanguage as deleteLanguageService,
  deleteMessage as deleteMessageService,
  deleteOrgType as deleteOrgTypeService,
  deleteRegion as deleteRegionService,
  deleteReligion as deleteReligionService,
  deleteSchoolLevel as deleteSchoolLevelService,
  deleteStage as deleteStageService,
  deleteStatus as deleteStatusService,
  getAllCountries as getAllCountriesService,
  getAllCredentialCategories as getAllCredentialCategoriesService,
  getAllCredentialLevels as getAllCredentialLevelsService,
  getAllCurrencies as getAllCurrenciesService,
  getAllDivisionTypes as getAllDivisionTypesService,
  getAllFieldsOfStudy as getAllFieldsOfStudyService,
  getAllGenres as getAllGenresService,
  getAllInstitutionClasses as getAllInstitutionClassesService,
  getAllInstitutionFundingSources as getAllInstitutionFundingSourcesService,
  getAllJobFunctions as getAllJobFunctionsService,
  getAllLanguages as getAllLanguagesService,
  getAllMembers as getAllMembersService,
  getAllMessages as getAllMessagesService,
  getAllMonths as getAllMonthsService,
  getAllOrgTypes as getAllOrgTypesService,
  getAllRegions as getAllRegionsService,
  getAllReligions as getAllReligionsService,
  getAllSchoolLevels as getAllSchoolLevelsService,
  getAllStages as getAllStagesService,
  getAllStatuses as getAllStatusesService,
  getAllTcsIntTypesByStateIdService,
  getAllTcsIntTypesService,
  getAllYesNo as getAllYesNoService,
  getSingleCountry as getSingleCountryService,
  getSingleCredentialCategory as getSingleCredentialCategoryService,
  getSingleCredentialLevel as getSingleCredentialLevelService,
  getSingleCurrency as getSingleCurrencyService,
  getSingleDivisionType as getSingleDivisionTypeService,
  getSingleFieldOfStudy as getSingleFieldOfStudyService,
  getSingleInstitutionClass as getSingleInstitutionClassService,
  getSingleInstitutionFundingSource as getSingleInstitutionFundingSourceService,
  getSingleJobFunction as getSingleJobFunctionService,
  getSingleLanguage as getSingleLanguageService,
  getSingleMessage as getSingleMessageService,
  getSingleOrgType as getSingleOrgTypeService,
  getSingleRegion as getSingleRegionService,
  getSingleReligion as getSingleReligionService,
  getSingleSchoolLevel as getSingleSchoolLevelService,
  getSingleStage as getSingleStageService,
  getSingleStatus as getSingleStatusService,
  updateCountry as updateCountryService,
  updateCredentialCategory as updateCredentialCategoryService,
  updateCredentialLevel as updateCredentialLevelService,
  updateCurrency as updateCurrencyService,
  updateDivisionType as updateDivisionTypeService,
  updateFieldOfStudy as updateFieldOfStudyService,
  updateInstitutionClass as updateInstitutionClassService,
  updateInstitutionFundingSource as updateInstitutionFundingSourceService,
  updateJobFunction as updateJobFunctionService,
  updateLanguage as updateLanguageService,
  updateMessage as updateMessageService,
  updateOrgType as updateOrgTypeService,
  updateRegion as updateRegionService,
  updateReligion as updateReligionService,
  updateSchoolLevel as updateSchoolLevelService,
  updateStage as updateStageService,
  updateStatus as updateStatusService
} from "../../services/glossary.service.js";

// ==========================================
//  Controller Factory Helpers
// ==========================================

const makeGetAll = (serviceFn, entityNameSingular, entityNamePlural) => async (req, res) => {
  try {
    const data = await serviceFn();
    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No ${entityNamePlural.toLowerCase()} found`
      });
    }
    return res.status(200).json({
      success: true,
      message: `${entityNamePlural} fetched successfully`,
      data
    });
  } catch (error) {
    console.error(`Get All ${entityNamePlural} Error:`, error);
    return res.status(500).json({
      success: false,
      message: `Failed to fetch ${entityNamePlural.toLowerCase()}.`
    });
  }
};

const makeGetSingle = (serviceFn, entityNameSingular, isIntKey) => async (req, res) => {
  try {
    const { id } = req.params;
    if (isIntKey && (id === undefined || isNaN(id))) {
      return res.status(400).json({ success: false, message: "Invalid ID format. Must be a number." });
    }
    if (!isIntKey && (!id || id.trim() === "")) {
      return res.status(400).json({ success: false, message: "Invalid code format." });
    }

    const item = await serviceFn(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: `${entityNameSingular} not found.`
      });
    }
    return res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error(`Get Single ${entityNameSingular} Error:`, error);
    return res.status(500).json({
      success: false,
      message: `Something went wrong while fetching the ${entityNameSingular.toLowerCase()}.`
    });
  }
};

const makeCreate = (serviceFn, entityNameSingular) => async (req, res) => {
  try {
    const result = await serviceFn(req.validatedBody);
    return res.status(201).json({
      success: true,
      message: `${entityNameSingular} created successfully!`,
      data: result
    });
  } catch (error) {
    console.error(`Create ${entityNameSingular} Error:`, error);
    return res.status(500).json({
      success: false,
      message: `Failed to create ${entityNameSingular.toLowerCase()}.`
    });
  }
};

const makeUpdate = (serviceFn, entityNameSingular, isIntKey) => async (req, res) => {
  try {
    const { id } = req.params;
    if (isIntKey && (id === undefined || isNaN(id))) {
      return res.status(400).json({ success: false, message: "Invalid ID format. Must be a number." });
    }
    if (!isIntKey && (!id || id.trim() === "")) {
      return res.status(400).json({ success: false, message: "Invalid code format." });
    }

    const result = await serviceFn(id, req.validatedBody);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: `${entityNameSingular} not found or no changes made.`
      });
    }
    return res.status(200).json({
      success: true,
      message: `${entityNameSingular} updated successfully!`
    });
  } catch (error) {
    console.error(`Update ${entityNameSingular} Error:`, error);
    return res.status(500).json({
      success: false,
      message: `Something went wrong while updating the ${entityNameSingular.toLowerCase()}.`
    });
  }
};

const makeDelete = (serviceFn, entityNameSingular, isIntKey) => async (req, res) => {
  try {
    const { id } = req.params;
    if (isIntKey && (id === undefined || isNaN(id))) {
      return res.status(400).json({ success: false, message: "Invalid ID format. Must be a number." });
    }
    if (!isIntKey && (!id || id.trim() === "")) {
      return res.status(400).json({ success: false, message: "Invalid code format." });
    }

    const result = await serviceFn(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: `${entityNameSingular} not found.`
      });
    }
    return res.status(200).json({
      success: true,
      message: `${entityNameSingular} deleted successfully!`
    });
  } catch (error) {
    console.error(`Delete ${entityNameSingular} Error:`, error);
    return res.status(500).json({
      success: false,
      message: `Something went wrong while deleting the ${entityNameSingular.toLowerCase()}.`
    });
  }
};




const makeGetAllByStateID = (serviceFn, entityNameSingular, entityNamePlural) => async (req, res) => {
  try {

    const { stateId } = req.params;
    if (!stateId || isNaN(stateId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid state ID format. Must be a number."
      });
    }

    const data = await serviceFn(stateId);
    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No ${entityNamePlural.toLowerCase()} found`
      });
    }
    return res.status(200).json({
      success: true,
      message: `${entityNamePlural} fetched successfully`,
      data
    });
  } catch (error) {
    console.error(`Get All ${entityNamePlural} Error:`, error);
    return res.status(500).json({
      success: false,
      message: `Failed to fetch ${entityNamePlural.toLowerCase()}.`
    });
  }
};



// ==========================================
//  Entity Controller Implementations
// ==========================================

// 1. Countries
export const getAllCountries = makeGetAll(getAllCountriesService, "Country", "Countries");
export const getSingleCountry = makeGetSingle(getSingleCountryService, "Country", false);
export const createCountry = makeCreate(createCountryService, "Country");
export const updateCountry = makeUpdate(updateCountryService, "Country", false);
export const deleteCountry = makeDelete(deleteCountryService, "Country", false);

// 2. Credential Category
export const getAllCredentialCategories = makeGetAll(getAllCredentialCategoriesService, "Credential Category", "Credential Categories");
export const getSingleCredentialCategory = makeGetSingle(getSingleCredentialCategoryService, "Credential Category", false);
export const createCredentialCategory = makeCreate(createCredentialCategoryService, "Credential Category");
export const updateCredentialCategory = makeUpdate(updateCredentialCategoryService, "Credential Category", false);
export const deleteCredentialCategory = makeDelete(deleteCredentialCategoryService, "Credential Category", false);

// 3. Credential Level
export const getAllCredentialLevels = makeGetAll(getAllCredentialLevelsService, "Credential Level", "Credential Levels");
export const getSingleCredentialLevel = makeGetSingle(getSingleCredentialLevelService, "Credential Level", true);
export const createCredentialLevel = makeCreate(createCredentialLevelService, "Credential Level");
export const updateCredentialLevel = makeUpdate(updateCredentialLevelService, "Credential Level", true);
export const deleteCredentialLevel = makeDelete(deleteCredentialLevelService, "Credential Level", true);

// 4. Currency
export const getAllCurrencies = makeGetAll(getAllCurrenciesService, "Currency", "Currencies");
export const getSingleCurrency = makeGetSingle(getSingleCurrencyService, "Currency", true);
export const createCurrency = makeCreate(createCurrencyService, "Currency");
export const updateCurrency = makeUpdate(updateCurrencyService, "Currency", true);
export const deleteCurrency = makeDelete(deleteCurrencyService, "Currency", true);

// 5. Division Type
export const getAllDivisionTypes = makeGetAll(getAllDivisionTypesService, "Division Type", "Division Types");
export const getSingleDivisionType = makeGetSingle(getSingleDivisionTypeService, "Division Type", true);
export const createDivisionType = makeCreate(createDivisionTypeService, "Division Type");
export const updateDivisionType = makeUpdate(updateDivisionTypeService, "Division Type", true);
export const deleteDivisionType = makeDelete(deleteDivisionTypeService, "Division Type", true);

// 6. Fields of Study
export const getAllFieldsOfStudy = makeGetAll(getAllFieldsOfStudyService, "Field of Study", "Fields of Study");
export const getSingleFieldOfStudy = makeGetSingle(getSingleFieldOfStudyService, "Field of Study", false);
export const createFieldOfStudy = makeCreate(createFieldOfStudyService, "Field of Study");
export const updateFieldOfStudy = makeUpdate(updateFieldOfStudyService, "Field of Study", false);
export const deleteFieldOfStudy = makeDelete(deleteFieldOfStudyService, "Field of Study", false);

// 7. Institution Classes
export const getAllInstitutionClasses = makeGetAll(getAllInstitutionClassesService, "Institution Class", "Institution Classes");
export const getSingleInstitutionClass = makeGetSingle(getSingleInstitutionClassService, "Institution Class", false);
export const createInstitutionClass = makeCreate(createInstitutionClassService, "Institution Class");
export const updateInstitutionClass = makeUpdate(updateInstitutionClassService, "Institution Class", false);
export const deleteInstitutionClass = makeDelete(deleteInstitutionClassService, "Institution Class", false);

// 8. Institution Funding Sources
export const getAllInstitutionFundingSources = makeGetAll(getAllInstitutionFundingSourcesService, "Institution Funding Source", "Institution Funding Sources");
export const getSingleInstitutionFundingSource = makeGetSingle(getSingleInstitutionFundingSourceService, "Institution Funding Source", true);
export const createInstitutionFundingSource = makeCreate(createInstitutionFundingSourceService, "Institution Funding Source");
export const updateInstitutionFundingSource = makeUpdate(updateInstitutionFundingSourceService, "Institution Funding Source", true);
export const deleteInstitutionFundingSource = makeDelete(deleteInstitutionFundingSourceService, "Institution Funding Source", true);

// 9. Job Function
export const getAllJobFunctions = makeGetAll(getAllJobFunctionsService, "Job Function", "Job Functions");
export const getSingleJobFunction = makeGetSingle(getSingleJobFunctionService, "Job Function", true);
export const createJobFunction = makeCreate(createJobFunctionService, "Job Function");
export const updateJobFunction = makeUpdate(updateJobFunctionService, "Job Function", true);
export const deleteJobFunction = makeDelete(deleteJobFunctionService, "Job Function", true);

// 10. Language
export const getAllLanguages = makeGetAll(getAllLanguagesService, "Language", "Languages");
export const getSingleLanguage = makeGetSingle(getSingleLanguageService, "Language", true);
export const createLanguage = makeCreate(createLanguageService, "Language");
export const updateLanguage = makeUpdate(updateLanguageService, "Language", true);
export const deleteLanguage = makeDelete(deleteLanguageService, "Language", true);

// 11. Messages
export const getAllMessages = makeGetAll(getAllMessagesService, "Message", "Messages");
export const getSingleMessage = makeGetSingle(getSingleMessageService, "Message", true);
export const createMessage = makeCreate(createMessageService, "Message");
export const updateMessage = makeUpdate(updateMessageService, "Message", true);
export const deleteMessage = makeDelete(deleteMessageService, "Message", true);

// 12. Regions
export const getAllRegions = makeGetAll(getAllRegionsService, "Region", "Regions");
export const getSingleRegion = makeGetSingle(getSingleRegionService, "Region", false);
export const createRegion = makeCreate(createRegionService, "Region");
export const updateRegion = makeUpdate(updateRegionService, "Region", false);
export const deleteRegion = makeDelete(deleteRegionService, "Region", false);

// 13. Religions
export const getAllReligions = makeGetAll(getAllReligionsService, "Religion", "Religions");
export const getSingleReligion = makeGetSingle(getSingleReligionService, "Religion", false);
export const createReligion = makeCreate(createReligionService, "Religion");
export const updateReligion = makeUpdate(updateReligionService, "Religion", false);
export const deleteReligion = makeDelete(deleteReligionService, "Religion", false);

// 14. School Levels
export const getAllSchoolLevels = makeGetAll(getAllSchoolLevelsService, "School Level", "School Levels");
export const getSingleSchoolLevel = makeGetSingle(getSingleSchoolLevelService, "School Level", true);
export const createSchoolLevel = makeCreate(createSchoolLevelService, "School Level");
export const updateSchoolLevel = makeUpdate(updateSchoolLevelService, "School Level", true);
export const deleteSchoolLevel = makeDelete(deleteSchoolLevelService, "School Level", true);

// 15. Stages
export const getAllStages = makeGetAll(getAllStagesService, "Stage", "Stages");
export const getSingleStage = makeGetSingle(getSingleStageService, "Stage", false);
export const createStage = makeCreate(createStageService, "Stage");
export const updateStage = makeUpdate(updateStageService, "Stage", false);
export const deleteStage = makeDelete(deleteStageService, "Stage", false);

// 16. Statuses
export const getAllStatuses = makeGetAll(getAllStatusesService, "Status", "Statuses");
export const getSingleStatus = makeGetSingle(getSingleStatusService, "Status", true);
export const createStatus = makeCreate(createStatusService, "Status");
export const updateStatus = makeUpdate(updateStatusService, "Status", true);
export const deleteStatus = makeDelete(deleteStatusService, "Status", true);

// 17. Org Types
export const getAllOrgTypes = makeGetAll(getAllOrgTypesService, "Org Type", "Org Types");
export const getSingleOrgType = makeGetSingle(getSingleOrgTypeService, "Org Type", true);
export const createOrgType = makeCreate(createOrgTypeService, "Org Type");
export const updateOrgType = makeUpdate(updateOrgTypeService, "Org Type", true);
export const deleteOrgType = makeDelete(deleteOrgTypeService, "Org Type", true);

// 18. YesNo
export const getAllYesNo = makeGetAll(getAllYesNoService, "YesNo", "YesNo");

// 19. Genre
export const getAllGenres = makeGetAll(getAllGenresService, "Genre", "Genres");

// 20. Member
export const getAllMembers = makeGetAll(getAllMembersService, "Member", "Members");

// 21. Month
export const getAllMonths = makeGetAll(getAllMonthsService, "Month", "Months");




export const getAllTcsIntTypes = makeGetAll(getAllTcsIntTypesService, "TcsIntType", "TcsIntTypes");
export const getAllTcsIntTypesByStateId = makeGetAllByStateID(getAllTcsIntTypesByStateIdService, "TcsIntTypeByStateID", "TcsIntTypeByStateIDs");