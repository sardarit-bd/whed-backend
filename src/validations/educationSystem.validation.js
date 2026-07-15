import Joi from "joi";

export const stateSystemSchema = Joi.object({
    StateID: Joi.number().integer().required().messages({
        "number.base": "StateID must be a number",
        "any.required": "StateID is required",
    }),
    sAgeOfEntry: Joi.number().integer().optional(),
    sAgeOfExit: Joi.number().integer().optional(),
    sSchoolSystem: Joi.string().optional().allow(""),
    sHESystem: Joi.string().optional().allow(""),
    sTrainingHETeachers: Joi.string().optional().allow(""),
    sDistanceHE: Joi.string().optional().allow(""),
    sNULAlternatives: Joi.string().optional().allow(""),
    sNULAdmissionTest: Joi.string().optional().allow(""),
    sNULNumerusClausus: Joi.string().optional().allow(""),
    sNULOtherRequirements: Joi.string().optional().allow(""),
    sULAlternatives: Joi.string().optional().allow(""),
    sULAdmissionTest: Joi.string().optional().allow(""),
    sULNumerusClausus: Joi.string().optional().allow(""),
    sULOtherRequirements: Joi.string().optional().allow(""),
    sFSDefinition: Joi.string().optional().allow(""),
    srFSAdmissionRequirements: Joi.string().optional().allow(""),
    sFSQuotas: Joi.string().optional().allow(""),
    sFSHealth: Joi.string().optional().allow(""),
    sFSLanguageProficiency: Joi.string().optional().allow(""),
    sFSEntryRegulations: Joi.string().optional().allow(""),
    sFSIndividualInst: Joi.number().integer().optional(),
    sFSCentralBody: Joi.number().integer().optional(),
    sRBSystemDesc: Joi.string().optional().allow(""),
    sRBNULStudies: Joi.string().optional().allow(""),
    sRBULStudies: Joi.string().optional().allow(""),
    sRBPLStudies: Joi.string().optional().allow(""),
    sRBProfession: Joi.string().optional().allow(""),
    sRBOtherInfoSources: Joi.string().optional().allow(""),
    sSSHome: Joi.number().integer().optional(),
    sSSHAmount: Joi.string().max(100).optional().allow(""),
    sSSForeign: Joi.number().integer().optional(),
    sSSFAmount: Joi.string().max(100).optional().allow(""),
    sSSFDetails: Joi.string().optional().allow(""),
    sTCRoad: Joi.number().integer().optional(),
    sTCRail: Joi.number().integer().optional(),
    sTCAir: Joi.number().integer().optional(),
    sTCforeign: Joi.number().integer().optional(),
    sFNAvLivingCost: Joi.string().optional().allow(""),
    sFNMinTuitionFee: Joi.string().max(100).optional().allow(""),
    sFNMaxTuitionFee: Joi.string().max(100).optional().allow(""),
    sFNMinTuitionFeeForeign: Joi.string().max(100).optional().allow(""),
    sFNMaxTuitionFeeForeign: Joi.string().max(100).optional().allow(""),
    sAcademicYearFrom: Joi.string().max(50).optional().allow(""),
    sAcademicYearTo: Joi.string().max(50).optional().allow(""),
    sSource: Joi.string().optional().allow(""),
    sMajorUpdateDate: Joi.date().optional(),
});


export const typeOfHeis = Joi.object({
    sInstType: Joi.string().required(),
    sInstTypeEnglish: Joi.string().optional().allow(null),
    sInstTypeDescription: Joi.string().optional().allow(null),
})

export const preHeis = Joi.object({
    sSchool: Joi.string().allow(null),
    sSchoolLevelCode: Joi.string().required(),
    sLength: Joi.number().allow(null),
    sAgeFrom: Joi.number().integer().allow(null),
    sAgeTo: Joi.number().integer().allow(null),
    sDiploma: Joi.string().allow(null),
});


export const updateStateSystemSchema = Joi.object({


    sAcademicYearFrom: Joi.number().integer().allow(null),
    sAcademicYearTo: Joi.number().integer().allow(null),

    sAgeOfEntry: Joi.number().integer().max(50).allow(null),
    sAgeOfExit: Joi.number().integer().max(50).allow(null),

    sSchoolSystem: Joi.string().allow(null),
    sHESystem: Joi.string().allow(null),
    sTrainingHETeachers: Joi.string().optional().allow(""),
    sDistanceHE: Joi.string().optional().allow(""),
    sSource: Joi.string().allow(null),
    sInCharge: Joi.string().allow(null),
    sNULAlternatives: Joi.string().allow(null),
    sNULAdmissionTest: Joi.string().allow(null),
    sNULOtherRequirements: Joi.string().allow(null),
    sNULNumerusClausus: Joi.string().allow(null),

    sULAlternatives: Joi.string().allow(null),
    sULAdmissionTest: Joi.string().allow(null),
    sULOtherRequirements: Joi.string().allow(null),
    sULNumerusClausus: Joi.string().allow(null),

    sFSDefinition: Joi.string().allow(null),
    sFSQuotas: Joi.string().allow(null),
    srFSAdmissionRequirements: Joi.string().allow(null),
    sFSEntryRegulations: Joi.string().allow(null),
    sFSHealth: Joi.string().allow(null),
    sFSLanguageProficiency: Joi.string().allow(null),

    sFSIndividualInst: Joi.number().integer().allow(null),
    sFSCentralBody: Joi.number().integer().allow(null),

    sRBSystemDesc: Joi.string().allow(null),
    sRBOtherInfoSources: Joi.string().allow(null),
    sRBNULStudies: Joi.string().allow(null),
    sRBULStudies: Joi.string().allow(null),
    sRBPLStudies: Joi.string().allow(null),
    sRBProfession: Joi.string().allow(null),

    sSSHome: Joi.number().integer().allow(null),
    sSSHAmount: Joi.number().allow(null),
    sSSHCurrencyCode: Joi.string().max(4).allow(null),

    sSSForeign: Joi.number().integer().allow(null),
    sSSFAmount: Joi.number().allow(null),
    sSSFCurrencyCode: Joi.string().max(4).allow(null),
    sSSFDetails: Joi.string().allow(null),

    sTCRoad: Joi.number().integer().allow(null),
    sTCRail: Joi.number().integer().allow(null),
    sTCAir: Joi.number().integer().allow(null),
    sTCforeign: Joi.number().integer().allow(null),

    sFNAvLivingCost: Joi.number().integer().allow(null),
    sFNALCCurrencyCode: Joi.string().max(4).allow(null),

    sFNMinTuitionFee: Joi.number().integer().allow(null),
    sFNMTFCCurrencyCode: Joi.string().max(4).allow(null),

    sFNMaxTuitionFee: Joi.number().integer().allow(null),
    sFNMxTFCCurrencyCode: Joi.string().max(4).allow(null),

    sFNMinTuitionFeeForeign: Joi.number().integer().allow(null),
    sFNMTFCfCurrencyCode: Joi.string().max(4).allow(null),

    sFNMaxTuitionFeeForeign: Joi.number().integer().allow(null),
    sFNMxTFCfCurrencyCode: Joi.string().max(4).allow(null),


    sTrainingHETeachers: Joi.string().allow(null),
    sDistanceHE: Joi.string().allow(null),

    sComment: Joi.string().allow(null),

}).min(1).messages({
    "object.min": "At least one field must be provided to update",
});


export const schoolSchema = Joi.object({
    StateID: Joi.number().integer().required(),
    sSchoolLevelCode: Joi.string().max(10).required(),
    sLength: Joi.string().max(50).optional().allow(""),
    sAgeFrom: Joi.number().integer().optional(),
    sAgeTo: Joi.number().integer().optional(),
    sDiploma: Joi.string().max(255).optional().allow(""),
});

export const updateSchoolSchema = Joi.object({
    sLength: Joi.string().max(50).optional().allow(""),
    sAgeFrom: Joi.number().integer().optional(),
    sAgeTo: Joi.number().integer().optional(),
    sDiploma: Joi.string().max(255).optional().allow(""),
}).min(1);

export const decreeSchema = Joi.object({
    sDecree: Joi.string().max(255).required(),
    sYearDecree: Joi.number().integer().optional(),
    sDecreeDesc: Joi.string().optional().allow(null),
});

export const updateDecreeSchema = Joi.object({
    sDecree: Joi.string().max(255).optional(),
    sYearDecree: Joi.number().integer().optional(),
    sDecreeDesc: Joi.string().optional().allow(null),
}).min(1);


export const agreementSchama = Joi.object({
    sAgreement: Joi.string().max(255).required(),
    sAgreementYear: Joi.number().integer().allow(null).optional(),
})

export const languageSchama = Joi.object({
    LanguageCode: Joi.string().max(255).required(),
})


export const stageSchema = Joi.object({
    StageCode: Joi.string().max(255).required(),
    sStageName: Joi.string().allow(null).optional(),
    sStageDescription: Joi.string().allow(null).optional(),
})



export const exchangeProgram = Joi.object({
    sExchangeProgram: Joi.string().max(255).required(),
})


export const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
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
