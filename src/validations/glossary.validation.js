import Joi from "joi";

// 1. Countries (whed_lex_country)
export const countrySchema = Joi.object({
  CountryCode: Joi.string().length(2).required(),
  Country: Joi.string().max(40).required(),
  RegionMap: Joi.string().max(40).optional().allow("").default(""),
  Clavier: Joi.string().max(10).optional().default("latin"),
  AddressFormat: Joi.string().max(100).optional().allow(""),
  DisplayFont: Joi.string().max(20).optional().default("Arial"),
  PostCodePos: Joi.string().max(4).optional().allow(""),
  CurrencyCode: Joi.string().max(3).optional().allow(""),
  CountryFr: Joi.string().max(50).optional().allow(""),
  PrintFundingHeads: Joi.number().integer().valid(0, 1).optional().default(0),
  Public: Joi.number().integer().valid(0, 1).optional().default(1),
  ISO3: Joi.string().max(3).optional().allow(""),
  RegionCRM: Joi.string().max(40).optional().allow("").default(""),
  RegionCodeCRM: Joi.string().max(3).optional().allow("").default(""),
  RegionSiteIAU: Joi.string().max(40).optional().allow("").default("")
});

export const updateCountrySchema = Joi.object({
  Country: Joi.string().max(40).optional(),
  RegionMap: Joi.string().max(40).optional().allow(""),
  Clavier: Joi.string().max(10).optional(),
  AddressFormat: Joi.string().max(100).optional().allow(""),
  DisplayFont: Joi.string().max(20).optional(),
  PostCodePos: Joi.string().max(4).optional().allow(""),
  CurrencyCode: Joi.string().max(3).optional().allow(""),
  CountryFr: Joi.string().max(50).optional().allow(""),
  PrintFundingHeads: Joi.number().integer().valid(0, 1).optional(),
  Public: Joi.number().integer().valid(0, 1).optional(),
  ISO3: Joi.string().max(3).optional().allow(""),
  RegionCRM: Joi.string().max(40).optional().allow(""),
  RegionCodeCRM: Joi.string().max(3).optional().allow(""),
  RegionSiteIAU: Joi.string().max(40).optional().allow("")
}).min(1);

// 2. Credential Category (whed_lex_credcat)
export const credCatSchema = Joi.object({
  CredCatCode: Joi.string().max(2).required(),
  CredCat: Joi.string().max(50).required()
});

export const updateCredCatSchema = Joi.object({
  CredCat: Joi.string().max(50).optional()
}).min(1);

// 3. Credential Level (whed_lex_credlevel)
export const credLevelSchema = Joi.object({
  CredLevelCode: Joi.string().max(2).required(),
  CredLevel: Joi.string().max(100).required(),
  CredLevelTypeOption: Joi.number().integer().optional().default(0),
  CredLevelPublic: Joi.number().integer().valid(0, 1).optional().default(1)
});

export const updateCredLevelSchema = Joi.object({
  CredLevelCode: Joi.string().max(2).optional(),
  CredLevel: Joi.string().max(100).optional(),
  CredLevelTypeOption: Joi.number().integer().optional(),
  CredLevelPublic: Joi.number().integer().valid(0, 1).optional()
}).min(1);

// 4. Currency (whed_lex_currency)
export const currencySchema = Joi.object({
  CurrencyCode: Joi.string().max(3).required(),
  Currency: Joi.string().max(40).required()
});

export const updateCurrencySchema = Joi.object({
  CurrencyCode: Joi.string().max(3).optional(),
  Currency: Joi.string().max(40).optional()
}).min(1);

// 5. Division Type (whed_lex_divisiontype)
export const divisionTypeSchema = Joi.object({
  DivisionTypeCode: Joi.string().max(3).required(),
  DivisionType: Joi.string().max(100).required(),
  MapToCode: Joi.string().max(3).optional().allow(""),
  OutputSortOrder: Joi.number().integer().optional().default(0),
  Niveau: Joi.number().integer().optional().default(0)
});

export const updateDivisionTypeSchema = Joi.object({
  DivisionTypeCode: Joi.string().max(3).optional(),
  DivisionType: Joi.string().max(100).optional(),
  MapToCode: Joi.string().max(3).optional().allow(""),
  OutputSortOrder: Joi.number().integer().optional(),
  Niveau: Joi.number().integer().optional()
}).min(1);

// 6. Fields of Study (whed_lex_fos)
export const fosSchema = Joi.object({
  FOSCode: Joi.string().max(6).required(),
  FOSLevel: Joi.number().integer().optional().default(0),
  Valide: Joi.number().integer().valid(0, 1).optional().default(1),
  FOSLevel1: Joi.string().max(160).optional().allow(""),
  FOSLevel2: Joi.string().max(160).optional().allow(""),
  FOSLevel3: Joi.string().max(160).optional().allow(""),
  FOSDisplay: Joi.string().max(60).optional().allow("")
});

export const updateFosSchema = Joi.object({
  FOSLevel: Joi.number().integer().optional(),
  Valide: Joi.number().integer().valid(0, 1).optional(),
  FOSLevel1: Joi.string().max(160).optional().allow(""),
  FOSLevel2: Joi.string().max(160).optional().allow(""),
  FOSLevel3: Joi.string().max(160).optional().allow(""),
  FOSDisplay: Joi.string().max(60).optional().allow("")
}).min(1);

// 7. Institution Classes (whed_lex_instclass)
export const instClassSchema = Joi.object({
  InstClassCode: Joi.string().max(2).required(),
  InstClass: Joi.string().max(100).required(),
  ClassUniversityLevel: Joi.number().integer().valid(0, 1).optional().default(0),
  InstClassSortOrder: Joi.number().integer().optional().default(0),
  ExportWHED: Joi.number().integer().valid(0, 1).optional().default(0),
  ExportXML: Joi.number().integer().valid(0, 1).optional().default(0)
});

export const updateInstClassSchema = Joi.object({
  InstClass: Joi.string().max(100).optional(),
  ClassUniversityLevel: Joi.number().integer().valid(0, 1).optional(),
  InstClassSortOrder: Joi.number().integer().optional(),
  ExportWHED: Joi.number().integer().valid(0, 1).optional(),
  ExportXML: Joi.number().integer().valid(0, 1).optional()
}).min(1);

// 8. Institution Funding Sources (whed_lex_instfundingtype)
export const instFundingTypeSchema = Joi.object({
  InstFundingTypeCode: Joi.string().max(2).required(),
  InstFundingType: Joi.string().max(30).required(),
  InstFundingTypeSortOrder: Joi.number().integer().optional().default(0),
  InstFundingNiveau: Joi.number().integer().optional().default(0),
  InstFundingDisplay: Joi.string().max(100).required()
});

export const updateInstFundingTypeSchema = Joi.object({
  InstFundingTypeCode: Joi.string().max(2).optional(),
  InstFundingType: Joi.string().max(30).optional(),
  InstFundingTypeSortOrder: Joi.number().integer().optional(),
  InstFundingNiveau: Joi.number().integer().optional(),
  InstFundingDisplay: Joi.string().max(100).optional()
}).min(1);

// 9. Job Function (whed_lex_jobfunction)
export const jobFunctionSchema = Joi.object({
  JobFunctionCode: Joi.string().max(2).required(),
  JobFunction: Joi.string().max(50).required(),
  PrintJobFunction: Joi.string().max(50).optional().allow("")
});

export const updateJobFunctionSchema = Joi.object({
  JobFunctionCode: Joi.string().max(2).optional(),
  JobFunction: Joi.string().max(50).optional(),
  PrintJobFunction: Joi.string().max(50).optional().allow("")
}).min(1);

// 10. Language (whed_lex_language)
export const languageSchema = Joi.object({
  LanguageCode: Joi.string().max(3).required(),
  Language: Joi.string().max(50).required()
});

export const updateLanguageSchema = Joi.object({
  LanguageCode: Joi.string().max(3).optional(),
  Language: Joi.string().max(50).optional()
}).min(1);

// 11. Messages (whed_lex_traduction)
export const traductionSchema = Joi.object({
  code: Joi.string().max(60).required(),
  en: Joi.string().required(),
  fr: Joi.string().required()
});

export const updateTraductionSchema = Joi.object({
  code: Joi.string().max(60).optional(),
  en: Joi.string().optional(),
  fr: Joi.string().optional()
}).min(1);

// 12. Regions (whed_lex_region)
export const regionSchema = Joi.object({
  RegionCode: Joi.string().max(2).required(),
  Region: Joi.string().max(50).required()
});

export const updateRegionSchema = Joi.object({
  Region: Joi.string().max(50).optional()
}).min(1);

// 13. Religions (whed_lex_religion)
export const religionSchema = Joi.object({
  ReligionCode: Joi.string().max(2).required(),
  Religion: Joi.string().max(50).required(),
  ReligionSortOrder: Joi.number().integer().optional().default(0)
});

export const updateReligionSchema = Joi.object({
  Religion: Joi.string().max(50).optional(),
  ReligionSortOrder: Joi.number().integer().optional()
}).min(1);

// 14. School Levels (whed_lex_schoollevel)
export const schoolLevelSchema = Joi.object({
  SchoolLevelCode: Joi.string().max(2).required(),
  SchoolLevel: Joi.string().max(100).required()
});

export const updateSchoolLevelSchema = Joi.object({
  SchoolLevelCode: Joi.string().max(2).optional(),
  SchoolLevel: Joi.string().max(100).optional()
}).min(1);

// 15. Stages (whed_lex_stage)
export const stageSchema = Joi.object({
  StageCode: Joi.string().max(2).required(),
  Stage: Joi.string().max(50).optional().allow(""),
  StageTypeOption: Joi.number().integer().optional().default(0)
});

export const updateStageSchema = Joi.object({
  Stage: Joi.string().max(50).optional().allow(""),
  StageTypeOption: Joi.number().integer().optional()
}).min(1);

// 16. Statuses (whed_lex_status)
export const statusSchema = Joi.object({
  StatusCode: Joi.number().integer().required(),
  Status: Joi.string().max(60).required(),
  Aide: Joi.string().optional().allow("")
});

export const updateStatusSchema = Joi.object({
  Status: Joi.string().max(60).optional(),
  Aide: Joi.string().optional().allow("")
}).min(1);

// 17. Org Types (whed_lex_orgtype)
export const orgTypeSchema = Joi.object({
  OrgTypeCode: Joi.string().max(2).required(),
  OrgType: Joi.string().max(100).required()
});

export const updateOrgTypeSchema = Joi.object({
  OrgTypeCode: Joi.string().max(2).optional(),
  OrgType: Joi.string().max(100).optional()
}).min(1);

/************** Validation Middleware Helper  ****************/
export const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,   // Show all validation errors
    stripUnknown: true,  // Strip unknown properties
  });

  if (error) {
    const errors = error.details.map((err) => ({
      field: err.context?.key || "unknown",
      message: err.message,
    }));
    return res.status(400).json({ success: false, errors });
  }

  req.validatedBody = value;
  next();
};
