import pool from "../config/db.js";

// ==========================================
//  Generic Database Operation Helpers
// ==========================================

const getAll = async (tableName, columns, orderByColumn) => {
  const query = `SELECT ${columns.join(", ")} FROM ${tableName} ORDER BY ${orderByColumn || columns[0]} ASC`;
  const [rows] = await pool.query(query);
  return rows;
};

const getById = async (tableName, idColumn, id, columns) => {
  const query = `SELECT ${columns.join(", ")} FROM ${tableName} WHERE ${idColumn} = ?`;
  const [rows] = await pool.query(query, [id]);
  return rows[0] || null;
};

const create = async (tableName, idColumn, allowedFields, data) => {
  const keys = Object.keys(data).filter(key => allowedFields.has(key));
  if (keys.length === 0) {
    throw new Error(`No valid fields provided for creation in ${tableName}`);
  }
  const values = keys.map(key => data[key]);
  const placeholders = keys.map(() => "?").join(", ");
  const columns = keys.join(", ");
  const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;

  const [result] = await pool.query(query, values);
  return { id: result.insertId || data[idColumn] };
};

const update = async (tableName, idColumn, id, allowedFields, data) => {
  const keys = Object.keys(data).filter(key => allowedFields.has(key));
  if (keys.length === 0) {
    return { affectedRows: 0 };
  }
  const values = keys.map(key => data[key]);
  const setClause = keys.map(key => `${key} = ?`).join(", ");
  const query = `UPDATE ${tableName} SET ${setClause} WHERE ${idColumn} = ?`;

  const [result] = await pool.query(query, [...values, id]);
  return result;
};

const remove = async (tableName, idColumn, id) => {
  const query = `DELETE FROM ${tableName} WHERE ${idColumn} = ?`;
  const [result] = await pool.query(query, [id]);
  return result;
};

// ==========================================
//  Domain Schemas Columns Definition
// ==========================================

// 1. Countries (whed_lex_country)
const COUNTRY_FIELDS = [
  "CountryCode", "Country", "RegionMap", "Clavier", "AddressFormat",
  "DisplayFont", "PostCodePos", "CurrencyCode", "CountryFr",
  "PrintFundingHeads", "Public", "ISO3", "RegionCRM", "RegionCodeCRM", "RegionSiteIAU"
];
const ALLOWED_COUNTRY_FIELDS = new Set(COUNTRY_FIELDS);

export const getAllCountries = () => getAll("whed_lex_country", COUNTRY_FIELDS, "Country");
export const getSingleCountry = (code) => getById("whed_lex_country", "CountryCode", code, COUNTRY_FIELDS);
export const createCountry = (data) => create("whed_lex_country", "CountryCode", ALLOWED_COUNTRY_FIELDS, data);
export const updateCountry = (code, data) => update("whed_lex_country", "CountryCode", code, ALLOWED_COUNTRY_FIELDS, data);
export const deleteCountry = (code) => remove("whed_lex_country", "CountryCode", code);

// 2. Credential Category (whed_lex_credcat)
const CREDCAT_FIELDS = ["CredCatCode", "CredCat"];
const ALLOWED_CREDCAT_FIELDS = new Set(CREDCAT_FIELDS);

export const getAllCredentialCategories = () => getAll("whed_lex_credcat", CREDCAT_FIELDS, "CredCat");
export const getSingleCredentialCategory = (code) => getById("whed_lex_credcat", "CredCatCode", code, CREDCAT_FIELDS);
export const createCredentialCategory = (data) => create("whed_lex_credcat", "CredCatCode", ALLOWED_CREDCAT_FIELDS, data);
export const updateCredentialCategory = (code, data) => update("whed_lex_credcat", "CredCatCode", code, ALLOWED_CREDCAT_FIELDS, data);
export const deleteCredentialCategory = (code) => remove("whed_lex_credcat", "CredCatCode", code);

// 3. Credential Level (whed_lex_credlevel)
const CREDLEVEL_FIELDS = ["CredLevelID", "CredLevelCode", "CredLevel", "CredLevelTypeOption", "CredLevelPublic"];
const ALLOWED_CREDLEVEL_FIELDS = new Set(["CredLevelCode", "CredLevel", "CredLevelTypeOption", "CredLevelPublic"]);

export const getAllCredentialLevels = () => getAll("whed_lex_credlevel", CREDLEVEL_FIELDS, "CredLevel");
export const getSingleCredentialLevel = (id) => getById("whed_lex_credlevel", "CredLevelID", id, CREDLEVEL_FIELDS);
export const createCredentialLevel = (data) => create("whed_lex_credlevel", "CredLevelID", ALLOWED_CREDLEVEL_FIELDS, data);
export const updateCredentialLevel = (id, data) => update("whed_lex_credlevel", "CredLevelID", id, ALLOWED_CREDLEVEL_FIELDS, data);
export const deleteCredentialLevel = (id) => remove("whed_lex_credlevel", "CredLevelID", id);

// 4. Currency (whed_lex_currency)
const CURRENCY_FIELDS = ["CurrencyID", "CurrencyCode", "Currency"];
const ALLOWED_CURRENCY_FIELDS = new Set(["CurrencyCode", "Currency"]);

export const getAllCurrencies = () => getAll("whed_lex_currency", CURRENCY_FIELDS, "Currency");
export const getSingleCurrency = (id) => getById("whed_lex_currency", "CurrencyID", id, CURRENCY_FIELDS);
export const createCurrency = (data) => create("whed_lex_currency", "CurrencyID", ALLOWED_CURRENCY_FIELDS, data);
export const updateCurrency = (id, data) => update("whed_lex_currency", "CurrencyID", id, ALLOWED_CURRENCY_FIELDS, data);
export const deleteCurrency = (id) => remove("whed_lex_currency", "CurrencyID", id);

// 5. Division Type (whed_lex_divisiontype)
const DIVISIONTYPE_FIELDS = ["DivisionTypeID", "DivisionTypeCode", "DivisionType", "MapToCode", "OutputSortOrder", "Niveau"];
const ALLOWED_DIVISIONTYPE_FIELDS = new Set(["DivisionTypeCode", "DivisionType", "MapToCode", "OutputSortOrder", "Niveau"]);

export const getAllDivisionTypes = () => getAll("whed_lex_divisiontype", DIVISIONTYPE_FIELDS, "OutputSortOrder");
export const getSingleDivisionType = (id) => getById("whed_lex_divisiontype", "DivisionTypeID", id, DIVISIONTYPE_FIELDS);
export const createDivisionType = (data) => create("whed_lex_divisiontype", "DivisionTypeID", ALLOWED_DIVISIONTYPE_FIELDS, data);
export const updateDivisionType = (id, data) => update("whed_lex_divisiontype", "DivisionTypeID", id, ALLOWED_DIVISIONTYPE_FIELDS, data);
export const deleteDivisionType = (id) => remove("whed_lex_divisiontype", "DivisionTypeID", id);

// 6. Fields of Study (whed_lex_fos)
const FOS_FIELDS = ["FOSCode", "FOSLevel", "Valide", "FOSLevel1", "FOSLevel2", "FOSLevel3", "FOSDisplay"];
const ALLOWED_FOS_FIELDS = new Set(FOS_FIELDS);

export const getAllFieldsOfStudy = () => getAll("whed_lex_fos", FOS_FIELDS, "FOSDisplay");
export const getSingleFieldOfStudy = (code) => getById("whed_lex_fos", "FOSCode", code, FOS_FIELDS);
export const createFieldOfStudy = (data) => create("whed_lex_fos", "FOSCode", ALLOWED_FOS_FIELDS, data);
export const updateFieldOfStudy = (code, data) => update("whed_lex_fos", "FOSCode", code, ALLOWED_FOS_FIELDS, data);
export const deleteFieldOfStudy = (code) => remove("whed_lex_fos", "FOSCode", code);

// 7. Institution Classes (whed_lex_instclass)
const INSTCLASS_FIELDS = ["InstClassCode", "InstClass", "ClassUniversityLevel", "InstClassSortOrder", "ExportWHED", "ExportXML"];
const ALLOWED_INSTCLASS_FIELDS = new Set(INSTCLASS_FIELDS);

export const getAllInstitutionClasses = () => getAll("whed_lex_instclass", INSTCLASS_FIELDS, "InstClassSortOrder");
export const getSingleInstitutionClass = (code) => getById("whed_lex_instclass", "InstClassCode", code, INSTCLASS_FIELDS);
export const createInstitutionClass = (data) => create("whed_lex_instclass", "InstClassCode", ALLOWED_INSTCLASS_FIELDS, data);
export const updateInstitutionClass = (code, data) => update("whed_lex_instclass", "InstClassCode", code, ALLOWED_INSTCLASS_FIELDS, data);
export const deleteInstitutionClass = (code) => remove("whed_lex_instclass", "InstClassCode", code);

// 8. Institution Funding Sources (whed_lex_instfundingtype)
const INSTFUNDING_FIELDS = ["InstFundingTypeID", "InstFundingTypeCode", "InstFundingType", "InstFundingTypeSortOrder", "InstFundingNiveau", "InstFundingDisplay"];
const ALLOWED_INSTFUNDING_FIELDS = new Set(["InstFundingTypeCode", "InstFundingType", "InstFundingTypeSortOrder", "InstFundingNiveau", "InstFundingDisplay"]);

export const getAllInstitutionFundingSources = () => getAll("whed_lex_instfundingtype", INSTFUNDING_FIELDS, "InstFundingTypeSortOrder");
export const getSingleInstitutionFundingSource = (id) => getById("whed_lex_instfundingtype", "InstFundingTypeID", id, INSTFUNDING_FIELDS);
export const createInstitutionFundingSource = (data) => create("whed_lex_instfundingtype", "InstFundingTypeID", ALLOWED_INSTFUNDING_FIELDS, data);
export const updateInstitutionFundingSource = (id, data) => update("whed_lex_instfundingtype", "InstFundingTypeID", id, ALLOWED_INSTFUNDING_FIELDS, data);
export const deleteInstitutionFundingSource = (id) => remove("whed_lex_instfundingtype", "InstFundingTypeID", id);

// 9. Job Function (whed_lex_jobfunction)
const JOBFUNCTION_FIELDS = ["JobFunctionID", "JobFunctionCode", "JobFunction", "PrintJobFunction"];
const ALLOWED_JOBFUNCTION_FIELDS = new Set(["JobFunctionCode", "JobFunction", "PrintJobFunction"]);

export const getAllJobFunctions = () => getAll("whed_lex_jobfunction", JOBFUNCTION_FIELDS, "JobFunction");
export const getSingleJobFunction = (id) => getById("whed_lex_jobfunction", "JobFunctionID", id, JOBFUNCTION_FIELDS);
export const createJobFunction = (data) => create("whed_lex_jobfunction", "JobFunctionID", ALLOWED_JOBFUNCTION_FIELDS, data);
export const updateJobFunction = (id, data) => update("whed_lex_jobfunction", "JobFunctionID", id, ALLOWED_JOBFUNCTION_FIELDS, data);
export const deleteJobFunction = (id) => remove("whed_lex_jobfunction", "JobFunctionID", id);

// 10. Language (whed_lex_language)
const LANGUAGE_FIELDS = ["LanguageID", "LanguageCode", "Language"];
const ALLOWED_LANGUAGE_FIELDS = new Set(["LanguageCode", "Language"]);

export const getAllLanguages = () => getAll("whed_lex_language", LANGUAGE_FIELDS, "Language");
export const getSingleLanguage = (id) => getById("whed_lex_language", "LanguageID", id, LANGUAGE_FIELDS);
export const createLanguage = (data) => create("whed_lex_language", "LanguageID", ALLOWED_LANGUAGE_FIELDS, data);
export const updateLanguage = (id, data) => update("whed_lex_language", "LanguageID", id, ALLOWED_LANGUAGE_FIELDS, data);
export const deleteLanguage = (id) => remove("whed_lex_language", "LanguageID", id);

// 11. Messages (whed_lex_traduction)
const TRADUCTION_FIELDS = ["TradID", "code", "en", "fr"];
const ALLOWED_TRADUCTION_FIELDS = new Set(["code", "en", "fr"]);

export const getAllMessages = () => getAll("whed_lex_traduction", TRADUCTION_FIELDS, "code");
export const getSingleMessage = (id) => getById("whed_lex_traduction", "TradID", id, TRADUCTION_FIELDS);
export const createMessage = (data) => create("whed_lex_traduction", "TradID", ALLOWED_TRADUCTION_FIELDS, data);
export const updateMessage = (id, data) => update("whed_lex_traduction", "TradID", id, ALLOWED_TRADUCTION_FIELDS, data);
export const deleteMessage = (id) => remove("whed_lex_traduction", "TradID", id);

// 12. Regions (whed_lex_region)
const REGION_FIELDS = ["RegionCode", "Region"];
const ALLOWED_REGION_FIELDS = new Set(REGION_FIELDS);

export const getAllRegions = () => getAll("whed_lex_region", REGION_FIELDS, "Region");
export const getSingleRegion = (code) => getById("whed_lex_region", "RegionCode", code, REGION_FIELDS);
export const createRegion = (data) => create("whed_lex_region", "RegionCode", ALLOWED_REGION_FIELDS, data);
export const updateRegion = (code, data) => update("whed_lex_region", "RegionCode", code, ALLOWED_REGION_FIELDS, data);
export const deleteRegion = (code) => remove("whed_lex_region", "RegionCode", code);

// 13. Religions (whed_lex_religion)
const RELIGION_FIELDS = ["ReligionCode", "Religion", "ReligionSortOrder"];
const ALLOWED_RELIGION_FIELDS = new Set(RELIGION_FIELDS);

export const getAllReligions = () => getAll("whed_lex_religion", RELIGION_FIELDS, "ReligionSortOrder");
export const getSingleReligion = (code) => getById("whed_lex_religion", "ReligionCode", code, RELIGION_FIELDS);
export const createReligion = (data) => create("whed_lex_religion", "ReligionCode", ALLOWED_RELIGION_FIELDS, data);
export const updateReligion = (code, data) => update("whed_lex_religion", "ReligionCode", code, ALLOWED_RELIGION_FIELDS, data);
export const deleteReligion = (code) => remove("whed_lex_religion", "ReligionCode", code);

// 14. School Levels (whed_lex_schoollevel)
const SCHOOLLEVEL_FIELDS = ["SchoolLevelID", "SchoolLevelCode", "SchoolLevel"];
const ALLOWED_SCHOOLLEVEL_FIELDS = new Set(["SchoolLevelCode", "SchoolLevel"]);

export const getAllSchoolLevels = () => getAll("whed_lex_schoollevel", SCHOOLLEVEL_FIELDS, "SchoolLevel");
export const getSingleSchoolLevel = (id) => getById("whed_lex_schoollevel", "SchoolLevelID", id, SCHOOLLEVEL_FIELDS);
export const createSchoolLevel = (data) => create("whed_lex_schoollevel", "SchoolLevelID", ALLOWED_SCHOOLLEVEL_FIELDS, data);
export const updateSchoolLevel = (id, data) => update("whed_lex_schoollevel", "SchoolLevelID", id, ALLOWED_SCHOOLLEVEL_FIELDS, data);
export const deleteSchoolLevel = (id) => remove("whed_lex_schoollevel", "SchoolLevelID", id);

// 15. Stages (whed_lex_stage)
const STAGE_FIELDS = ["StageCode", "Stage", "StageTypeOption"];
const ALLOWED_STAGE_FIELDS = new Set(STAGE_FIELDS);

export const getAllStages = () => getAll("whed_lex_stage", STAGE_FIELDS, "Stage");
export const getSingleStage = (code) => getById("whed_lex_stage", "StageCode", code, STAGE_FIELDS);
export const createStage = (data) => create("whed_lex_stage", "StageCode", ALLOWED_STAGE_FIELDS, data);
export const updateStage = (code, data) => update("whed_lex_stage", "StageCode", code, ALLOWED_STAGE_FIELDS, data);
export const deleteStage = (code) => remove("whed_lex_stage", "StageCode", code);

// 16. Statuses (whed_lex_status)
const STATUS_FIELDS = ["StatusCode", "Status", "Aide"];
const ALLOWED_STATUS_FIELDS = new Set(STATUS_FIELDS);

export const getAllStatuses = () => getAll("whed_lex_status", STATUS_FIELDS, "StatusCode");
export const getSingleStatus = (id) => getById("whed_lex_status", "StatusCode", id, STATUS_FIELDS);
export const createStatus = (data) => create("whed_lex_status", "StatusCode", ALLOWED_STATUS_FIELDS, data);
export const updateStatus = (id, data) => update("whed_lex_status", "StatusCode", id, ALLOWED_STATUS_FIELDS, data);
export const deleteStatus = (id) => remove("whed_lex_status", "StatusCode", id);

// 17. Org Types (whed_lex_orgtype)
const ORGTYPE_FIELDS = ["OrgTypeID", "OrgTypeCode", "OrgType"];
const ALLOWED_ORGTYPE_FIELDS = new Set(["OrgTypeCode", "OrgType"]);

export const getAllOrgTypes = () => getAll("whed_lex_orgtype", ORGTYPE_FIELDS, "OrgType");
export const getSingleOrgType = (id) => getById("whed_lex_orgtype", "OrgTypeID", id, ORGTYPE_FIELDS);
export const createOrgType = (data) => create("whed_lex_orgtype", "OrgTypeID", ALLOWED_ORGTYPE_FIELDS, data);
export const updateOrgType = (id, data) => update("whed_lex_orgtype", "OrgTypeID", id, ALLOWED_ORGTYPE_FIELDS, data);
export const deleteOrgType = (id) => remove("whed_lex_orgtype", "OrgTypeID", id);

// 18. YesNo (whed_lex_yesno)
const YESNO_FIELDS = ["YesNo", "YesNoCode"];
export const getAllYesNo = () => getAll("whed_lex_yesno", YESNO_FIELDS, "YesNo");

// 19. Genre (whed_lex_genre)
const GENRE_FIELDS = ["Genre", "GenreCode"];
export const getAllGenres = () => getAll("whed_lex_genre", GENRE_FIELDS, "Genre");

// 20. Member (whed_lex_member)
const MEMBER_FIELDS = ["Member", "MemberCode"];
export const getAllMembers = () => getAll("whed_lex_member", MEMBER_FIELDS, "Member");

// 21. Month (whed_lex_month)
const MONTH_FIELDS = ["Month", "MonthNumber"];
export const getAllMonths = () => getAll("whed_lex_month", MONTH_FIELDS, "MonthNumber");




export const getAllTcsIntTypesService = async () => {
  const query = `SELECT * FROM whed_tcsinsttype ORDER BY sInstTypeSort`;
  const [rows] = await pool.query(query);
  return rows;
};

export const getAllTcsIntTypesByStateIdService = async (stateId) => {
  const query = `SELECT * FROM whed_tcsinsttype WHERE StateID = ? ORDER BY sInstTypeSort`;
  const [rows] = await pool.query(query, [stateId]);
  return rows;
};