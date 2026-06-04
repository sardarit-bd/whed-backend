import Joi from "joi";

const instituteSchema = Joi.object({


    nameInEnglish: Joi.string().min(2).max(100).required(),

    name: Joi.string().min(2).max(100).required(),

    branchof: Joi.string().allow(""),

    acronym: Joi.string().allow(""),

    alternativeName: Joi.number().allow(""),

    street: Joi.string().allow("").optional(),

    city: Joi.string().required(),

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

    menbershiplistingothers: Joi.string().required().valid("yes", "no").default("no"),

    yearofcreation: Joi.number().integer().min(1000).max(new Date().getFullYear()).optional(),

    admissionrequirements: Joi.string().allow("").optional(),

    tuitionfees: Joi.string().allow("").optional(),

    nationalstudents: Joi.number().integer().min(0).optional(),

    internationalstudents: Joi.number().integer().min(0).optional(),

    languageofinstruction: Joi.string().allow("").optional(),

    nameofyournationalcompetentaccreditationbody: Joi.string().allow("").optional(),

    dateoftheaccreditationlastused: Joi.date().optional(),

    religiousaffiliation: Joi.string().allow("").optional(),

    studentbody: Joi.string().allow("").optional(),





    // officers tab

    fullName: Joi.string().min(3).max(100).required(),

    jobtitle: Joi.string().min(2).max(100).allow("").optional(),

    jobfunction: Joi.string().min(2).max(100).required(),

    yearofoffice: Joi.number().integer().min(1900).max(new Date().getFullYear()).optional(),

    contacttel: Joi.string().allow("").optional(),

    contactemail: Joi.string().email().allow("").optional(),

    gender: Joi.string().valid("male", "female", "other").optional(),




});

export default instituteSchema;
