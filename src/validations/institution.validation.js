import Joi from "joi";

export const instituteSchema = Joi.object({
    // --- Required Fields (Null = NO & No Default Value) ---
    OrgName: Joi.string().max(160).required().messages({
        "string.empty": "OrgName is required",
        "any.required": "OrgName is required"
    }),
});





/************** Update Institute Schema ****************/
export const updateInstituteSchema = Joi.object({
    // --- Identifiers (OrgID is usually passed in req.params, but kept here if needed in body) ---
    OrgID: Joi.number().integer().positive().optional(),
    GlobalID: Joi.string().max(17).allow("", null).optional(),
    iParentOrgID: Joi.number().integer().positive().allow(null).optional(),
    AliasID: Joi.number().integer().optional(),
    Family: Joi.number().integer().min(0).max(255).optional(),

    // --- Core Names (Optional, but if provided, cannot be empty or just spaces) ---
    OrgName: Joi.string().trim().max(160).optional().messages({
        "string.empty": "OrgName cannot be empty or just spaces"
    }),
    iBranchName: Joi.string().trim().max(160).optional().messages({
        "string.empty": "iBranchName cannot be empty or just spaces"
    }),
    InstNameEnglish: Joi.string().trim().max(160).optional().messages({
        "string.empty": "InstNameEnglish cannot be empty or just spaces"
    }),
    iBranchNameEnglish: Joi.string().trim().max(160).optional().messages({
        "string.empty": "iBranchNameEnglish cannot be empty or just spaces"
    }),
    iRecordHistory: Joi.string().trim().optional().messages({
        "string.empty": "iRecordHistory cannot be empty"
    }),

    // --- Location & Codes ---
    CountryCode: Joi.string().max(2).allow("", null).optional(),
    StateCode: Joi.string().max(2).allow("", null).optional(),
    StateID: Joi.number().integer().positive().allow(null).optional(),
    BranchID: Joi.number().integer().positive().allow(null).optional(),
    OrgTypeCode: Joi.string().max(2).allow("", null).optional(),
    InstNameAlt: Joi.string().max(160).allow("", null).optional(),
    InstAcronym: Joi.string().max(50).allow("", null).optional(),
    InstClassCode: Joi.string().max(2).allow("", null).optional(),
    InstFundingTypeCode: Joi.string().max(2).allow("", null).optional(),

    // --- Membership & Media ---
    iIAUMembershipOption: Joi.number().integer().optional(),
    iIAULogo: Joi.string().max(200).allow("", null).optional(),
    iIAUNews: Joi.string().allow("", null).optional(),
    iAAUMembershipOption: Joi.number().integer().optional(),
    iOtherSites: Joi.string().allow("", null).optional(),

    // --- Institutional Details ---
    iHistory: Joi.string().allow("", null).optional(),
    iAdmissionRequirements: Joi.string().allow("", null).optional(),
    iFeesN: Joi.string().allow("", null).optional(),
    iFeesNCurrencyCode: Joi.string().max(4).allow("", null).optional(),
    iFeesI: Joi.string().allow("", null).optional(),
    iFeesICurrencyCode: Joi.string().max(4).allow("", null).optional(),
    iAcademicYear: Joi.string().max(243).allow("", null).optional(),
    iLanguagesUsed: Joi.string().max(176).allow("", null).optional(),
    iLibrary: Joi.string().allow("", null).optional(),
    iMainPress: Joi.string().max(155).allow("", null).optional(),
    iResidentialFacilities: Joi.string().allow("", null).optional(),
    iCreated: Joi.string().max(18).allow("", null).optional(),
    iPresentStatusYear: Joi.string().max(41).allow("", null).optional(),

    // --- Staff Statistics ---
    iStaffStatisticsYear: Joi.string().max(10).allow("", null).optional(),
    iStaffStatisticsApprox: Joi.number().integer().min(0).max(1).optional(),
    iStaffFullTimeTotal: Joi.number().integer().min(0).allow(null).optional(),
    iStaffFullTimeMale: Joi.number().integer().min(0).allow(null).optional(),
    iStaffFullTimeFemale: Joi.number().integer().min(0).allow(null).optional(),
    iStaffPartTimeTotal: Joi.number().integer().min(0).allow(null).optional(),
    iStaffPartTimeFemale: Joi.number().integer().min(0).allow(null).optional(),
    iStaffPartTimeMale: Joi.number().integer().min(0).allow(null).optional(),
    iStaffDocFullTimeTotal: Joi.number().integer().min(0).allow(null).optional(),
    iStaffDocFullTimeMale: Joi.number().integer().min(0).allow(null).optional(),
    iStaffDocFullTimeFemale: Joi.number().integer().min(0).allow(null).optional(),

    // --- Student Statistics ---
    iStudentStatisticsYear: Joi.string().max(10).allow("", null).optional(),
    iStudentStatisticsApprox: Joi.number().integer().min(0).max(1).optional(),
    iStudentTotal: Joi.number().integer().min(0).allow(null).optional(),
    iStudentMale: Joi.number().integer().min(0).allow(null).optional(),
    iStudentFemale: Joi.number().integer().min(0).allow(null).optional(),
    iStudentForeignTotal: Joi.number().integer().min(0).allow(null).optional(),
    iStudentForeignMale: Joi.number().integer().min(0).allow(null).optional(),
    iStudentForeignFemale: Joi.number().integer().min(0).allow(null).optional(),
    iStudentPartTime: Joi.number().integer().min(0).allow(null).optional(),
    iStudentDistance: Joi.number().integer().min(0).allow(null).optional(),
    iStudentsDisabilities: Joi.number().integer().min(0).allow(null).optional(),

    // --- Accreditation & Affiliation ---
    iAccreditingAgency: Joi.string().allow("", null).optional(),
    iAccreditationEndDate: Joi.string().max(18).allow("", null).optional(),
    sInstTypeID: Joi.number().integer().positive().allow(null).optional(),
    ReligionCode: Joi.string().max(2).allow("", null).optional(),
    iStudentBody: Joi.string().max(1).allow("", null).optional(),

    // --- Student Services (iSS Fields) ---
    iSSAcademicCounselling: Joi.number().integer().min(0).max(1).optional(),
    iSSSocialCounselling: Joi.number().integer().min(0).max(1).optional(),
    iSSCareersAdvices: Joi.number().integer().min(0).max(1).optional(),
    iSSNurseryCare: Joi.number().integer().min(0).max(1).optional(),
    iSSCulturalActivities: Joi.number().integer().min(0).max(1).optional(),
    iSSSportsFacilities: Joi.number().integer().min(0).max(1).optional(),
    iSSLanguageLaboratory: Joi.number().integer().min(0).max(1).optional(),
    iSSDisabledFacilities: Joi.number().integer().min(0).max(1).optional(),
    iSSHealthServices: Joi.number().integer().min(0).max(1).optional(),
    iSSCanteen: Joi.number().integer().min(0).max(1).optional(),
    iSSLibrary: Joi.number().integer().min(0).max(1).optional(),
    iSSeLibrary: Joi.number().integer().min(0).max(1).optional(),
    iSSResidentialFacilities: Joi.number().integer().min(0).max(1).optional(),
    iSSITCentre: Joi.number().integer().min(0).max(1).optional(),
    iSSForeignStudiesCentre: Joi.number().integer().min(0).max(1).optional(),
    iSSOnlineDistanceLearning: Joi.number().integer().min(0).max(1).optional(),

    // --- Misc Notes & System Dates ---
    iDegreeNote: Joi.string().allow("", null).optional(),
    iInputDate: Joi.date().iso().optional(),
    iMajorUpdateDate: Joi.date().iso().optional(),
    iMinorUpdateDate: Joi.date().iso().optional(),
    iMajorUpdateDateDP: Joi.date().iso().optional(),

    // --- Contact Address ---
    Street: Joi.string().allow("", null).optional(),
    City: Joi.string().max(60).allow("", null).optional(),
    Province: Joi.string().max(60).allow("", null).optional(),
    PostCode: Joi.string().max(40).allow("", null).optional(),
    Tel: Joi.string().max(60).allow("", null).optional(),
    Fax: Joi.string().max(60).allow("", null).optional(),
    EMail: Joi.string().email().max(100).allow("", null).optional(),
    WWW: Joi.string().uri().allow("", null).optional(),
    UserID: Joi.number().integer().positive().allow(null).optional(),

    // --- Control Flags & DP Status ---
    iWarning: Joi.number().integer().optional(),
    iDelete: Joi.number().integer().optional(),
    DPTypeContact: Joi.number().integer().optional(),
    DPName: Joi.string().max(100).allow("", null).optional(),
    DPEMail: Joi.string().email().max(100).allow("", null).optional(),
    DPEMailCopie: Joi.string().email().max(100).allow("", null).optional(),
    DPStatus: Joi.number().integer().optional(),
    DPFlag: Joi.number().integer().optional(),
    DPControle: Joi.string().max(32).allow("").optional(),

    // --- DP Unix Timestamps / Epoch integers ---
    DPDateEnvoi: Joi.number().integer().optional(),
    DPDateLimite: Joi.number().integer().optional(),
    DPDateAcces: Joi.number().integer().optional(),
    DPDateModif: Joi.number().integer().optional(),
    DPDateRelance: Joi.number().integer().optional(),
    DPDateRetour: Joi.number().integer().optional(),
    DPDateValid: Joi.number().integer().optional(),
    DPNbrRelance: Joi.number().integer().optional(),
    DPHistRelance: Joi.string().allow("", null).optional(),

    // --- Final Status Fields ---
    iUpdate: Joi.number().integer().optional(),
    iLearning: Joi.number().integer().optional(),
    iLogo: Joi.string().max(50).allow("", null).optional(),
    iWebUpdateDate: Joi.date().iso().optional(),
    iComment: Joi.string().allow("", null).optional(),
    iPartnership: Joi.string().max(50).allow("", null).optional(),
    DateAccredited: Joi.string().allow("", null).optional(),
    iOther: Joi.number().integer().optional(),
    iInstClassHistory: Joi.string().allow(null).optional()
}).min(1).messages({
    "object.min": "At least one field must be provided to update",
});






/************** Validation Middleware Helper ****************/
export const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,   // সব error একসাথে দেখাবে
        stripUnknown: true,  // extra field গুলো remove করবে
    });

    if (error) {
        const errors = error.details.map((err) => ({
            field: err.context?.key || "unknown",
            message: err.message,
        }));
        return res.status(400).json({ success: false, errors });
    }

    req.validatedBody = value; // sanitized data পরবর্তী middleware-এ পাঠাবে
    next();
};
