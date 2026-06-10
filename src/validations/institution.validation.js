import Joi from "joi";

export const instituteSchema = Joi.object({
    nameInEnglish: Joi.string().min(2).max(100).required().messages({
        "string.base": "Institution Name in English must be a text",
        "string.empty": "Institution Name in English is required",
        "string.min": "Institution Name in English must be at least 2 characters long",
        "string.max": "Institution Name in English cannot exceed 100 characters",
        "any.required": "Institution Name in English is required",
    }),

    name: Joi.string().min(2).max(100).required().messages({
        "string.base": "Local Name of Institution must be a text",
        "string.empty": "Local Name of Institution is required",
        "string.min": "Local Name of Institution must be at least 2 characters long",
        "string.max": "Local Name of Institution cannot exceed 100 characters",
        "any.required": "Local Name of Institution is required",
    }),

    StateID: Joi.number().integer().required().messages({
        "number.base": "StateID must be a number",
        "any.required": "StateID is required",
    }),
    CountryCode: Joi.string().max(5).optional().allow(""),
    StateCode: Joi.string().max(5).optional().allow(""),
    fundingType: Joi.string().max(10).optional().allow(""),
    classCode: Joi.string().max(10).optional().allow(""),

    branchof: Joi.string().allow("").optional(),
    acronym: Joi.string().allow("").optional(),
    alternativeName: Joi.number().allow("").optional(),
    street: Joi.string().allow("").optional(),

    city: Joi.string().required().messages({
        "string.base": "City must be a text",
        "string.empty": "City is required",
        "any.required": "City is required",
    }),

    province: Joi.string().allow("").optional(),
    postalCode: Joi.string().allow("").optional(),
    tel: Joi.string().allow("").optional(),
    fax: Joi.string().allow("").optional(),
    email: Joi.string().allow("").optional(),
    website: Joi.string().allow("").optional(),
    logo: Joi.string().allow("").optional(),
    otherPysicalLocation: Joi.string().allow("").optional(),
    learningMiscellanea: Joi.string().allow("").optional(),
    typeofInstitute: Joi.string().allow("").optional(),
    religion: Joi.string().allow("").optional(),
    news: Joi.string().allow("").optional(),
    iauMembership: Joi.string().allow("").optional(),

    menbershiplistingothers: Joi.string().required().valid("yes", "no").default("no").messages({
        "any.only": "Membership listing others must be either 'yes' or 'no'",
        "any.required": "Membership listing others is required",
    }),

    yearofcreation: Joi.number().integer().min(1000).max(new Date().getFullYear()).optional().messages({
        "number.base": "Year of creation must be a number",
        "number.min": "Year of creation cannot be before 1000",
        "number.max": "Year of creation cannot be in the future",
    }),

    admissionrequirements: Joi.string().allow("").optional(),
    tuitionfees: Joi.string().allow("").optional(),
    nationalstudents: Joi.number().integer().min(0).optional().messages({
        "number.base": "National students count must be a number",
        "number.min": "National students count cannot be negative",
    }),
    internationalstudents: Joi.number().integer().min(0).optional().messages({
        "number.base": "International students count must be a number",
        "number.min": "International students count cannot be negative",
    }),
    languageofinstruction: Joi.string().allow("").optional(),
    nameofyournationalcompetentaccreditationbody: Joi.string().allow("").optional(),
    dateoftheaccreditationlastused: Joi.date().optional(),
    religiousaffiliation: Joi.string().allow("").optional(),
    studentbody: Joi.string().allow("").optional(),

    // officers tab
    fullName: Joi.string().min(3).max(100).required().messages({
        "string.base": "Officer Full Name must be a text",
        "string.empty": "Officer Full Name is required",
        "string.min": "Officer Full Name must be at least 3 characters long",
        "string.max": "Officer Full Name cannot exceed 100 characters",
        "any.required": "Officer Full Name is required",
    }),

    jobtitle: Joi.string().min(2).max(100).allow("").optional(),

    jobfunction: Joi.string().min(2).max(100).required().messages({
        "string.base": "Job Function must be a text",
        "string.empty": "Job Function is required",
        "string.min": "Job Function must be at least 2 characters long",
        "string.max": "Job Function cannot exceed 100 characters",
        "any.required": "Job Function is required",
    }),

    yearofoffice: Joi.number().integer().min(1900).max(new Date().getFullYear()).optional(),
    contacttel: Joi.string().allow("").optional(),
    contactemail: Joi.string().email().allow("").optional().messages({
        "string.email": "Contact Email must be a valid email address",
    }),
    gender: Joi.string().valid("male", "female", "other").optional(),
});







/************** Update Institute Schema ****************/
export const updateInstituteSchema = Joi.object({
    GlobalID: Joi.string().max(17).optional(),
    iParentOrgID: Joi.number().integer().optional(),
    AliasID: Joi.number().integer().optional(),
    Family: Joi.number().integer().optional(),
    OrgName: Joi.string().max(160).optional(),
    iBranchName: Joi.string().max(160).optional(),
    InstNameEnglish: Joi.string().max(160).optional(),
    iBranchNameEnglish: Joi.string().max(160).optional(),
    CountryCode: Joi.string().max(2).optional(),
    StateCode: Joi.string().max(2).optional(),
    StateID: Joi.number().integer().optional(),
    BranchID: Joi.number().integer().optional(),
    OrgTypeCode: Joi.string().max(2).optional(),
    InstNameAlt: Joi.string().max(160).optional().allow(""),
    InstAcronym: Joi.string().max(50).optional().allow(""),
    InstClassCode: Joi.string().max(2).optional(),
    InstFundingTypeCode: Joi.string().max(2).optional(),
    iIAUMembershipOption: Joi.number().integer().optional(),
    iIAULogo: Joi.string().max(200).optional().allow(""),
    iIAUNews: Joi.string().optional().allow(""),
    iAAUMembershipOption: Joi.number().integer().optional(),
    iOtherSites: Joi.string().optional().allow(""),
    iHistory: Joi.string().optional().allow(""),
    iAdmissionRequirements: Joi.string().optional().allow(""),
    iFeesN: Joi.string().optional().allow(""),
    iFeesNCurrencyCode: Joi.string().max(4).optional().allow(""),
    iFeesI: Joi.string().optional().allow(""),
    iFeesICurrencyCode: Joi.string().max(4).optional().allow(""),
    iAcademicYear: Joi.string().max(243).optional().allow(""),
    iLanguagesUsed: Joi.string().max(176).optional().allow(""),
    iLibrary: Joi.string().optional().allow(""),
    iMainPress: Joi.string().max(155).optional().allow(""),
    iResidentialFacilities: Joi.string().optional().allow(""),
    iCreated: Joi.string().max(18).optional(),
    iPresentStatusYear: Joi.string().max(41).optional(),
    iStaffStatisticsYear: Joi.string().max(10).optional(),
    iStaffStatisticsApprox: Joi.number().integer().optional(),
    iStaffFullTimeTotal: Joi.number().integer().optional(),
    iStaffFullTimeMale: Joi.number().integer().optional(),
    iStaffFullTimeFemale: Joi.number().integer().optional(),
    iStaffPartTimeTotal: Joi.number().integer().optional(),
    iStaffPartTimeFemale: Joi.number().integer().optional(),
    iStaffPartTimeMale: Joi.number().integer().optional(),
    iStaffDocFullTimeTotal: Joi.number().integer().optional(),
    iStaffDocFullTimeMale: Joi.number().integer().optional(),
    iStaffDocFullTimeFemale: Joi.number().integer().optional(),
    iStudentStatisticsYear: Joi.string().max(10).optional(),
    iStudentStatisticsApprox: Joi.number().integer().optional(),
    iStudentTotal: Joi.number().integer().optional(),
    iStudentMale: Joi.number().integer().optional(),
    iStudentFemale: Joi.number().integer().optional(),
    iStudentForeignTotal: Joi.number().integer().optional(),
    iStudentForeignMale: Joi.number().integer().optional(),
    iStudentForeignFemale: Joi.number().integer().optional(),
    iStudentPartTime: Joi.number().integer().optional(),
    iStudentDistance: Joi.number().integer().optional(),
    iStudentsDisabilities: Joi.number().integer().optional(),
    iAccreditingAgency: Joi.string().optional().allow(""),
    iAccreditationEndDate: Joi.string().max(18).optional().allow(""),
    sInstTypeID: Joi.number().integer().optional(),
    ReligionCode: Joi.string().max(2).optional().allow(""),
    iStudentBody: Joi.string().max(1).optional().allow(""),
    Street: Joi.string().optional().allow(""),
    City: Joi.string().max(60).optional().allow(""),
    Province: Joi.string().max(60).optional().allow(""),
    PostCode: Joi.string().max(40).optional().allow(""),
    Tel: Joi.string().max(60).optional().allow(""),
    Fax: Joi.string().max(60).optional().allow(""),
    EMail: Joi.string().email({ tlds: { allow: false } }).max(100).optional().allow(""),
    WWW: Joi.string().optional().allow(""),
    UserID: Joi.number().integer().optional(),
    iWarning: Joi.number().integer().optional(),
    iDelete: Joi.number().integer().optional(),
    DPTypeContact: Joi.number().integer().optional(),
    DPName: Joi.string().max(100).optional().allow(""),
    DPEMail: Joi.string().email({ tlds: { allow: false } }).max(100).optional().allow(""),
    DPEMailCopie: Joi.string().email({ tlds: { allow: false } }).max(100).optional().allow(""),
    DPStatus: Joi.number().integer().optional(),
    DPFlag: Joi.number().integer().optional(),
    DPControle: Joi.string().max(32).optional().allow(""),
    iUpdate: Joi.number().integer().optional(),
    iLearning: Joi.number().integer().optional(),
    iLogo: Joi.string().max(50).optional().allow(""),
    iComment: Joi.string().optional().allow(""),
    iPartnership: Joi.string().max(50).optional().allow(""),
    DateAccredited: Joi.string().optional().allow(""),
    iOther: Joi.number().integer().optional(),
    iInstClassHistory: Joi.string().optional().allow(""),
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
