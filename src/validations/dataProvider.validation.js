import Joi from "joi";

export const dataProviderSchema = Joi.object({
    StateID: Joi.number().integer().required(),
    DPTypeContact: Joi.number().integer().optional(),
    DPOrgName: Joi.string().max(255).optional().allow(""),
    DPName: Joi.string().max(150).optional().allow(""),
    DPStreet: Joi.string().max(255).optional().allow(""),
    DPCity: Joi.string().max(150).optional().allow(""),
    DPProvince: Joi.string().max(150).optional().allow(""),
    DPPostCode: Joi.string().max(50).optional().allow(""),
    DPEMail: Joi.string().email().max(150).required().messages({
        "string.email": "Invalid contact email",
        "any.required": "DP email is required",
    }),
    DPEMailCopie: Joi.string().email().max(150).optional().allow(""),
    DPStatus: Joi.number().integer().min(0).max(6).optional().default(0),
    DPFlag: Joi.number().integer().optional(),
    DPDateEnvoi: Joi.number().integer().optional(),
    DPDateRelance: Joi.number().integer().optional(),
    DPDateLimite: Joi.number().integer().optional(),
    DPDateRetour: Joi.number().integer().optional(),
    DPDateValid: Joi.number().integer().optional(),
    DPDateAcces: Joi.number().integer().optional(),
    DPDateModif: Joi.number().integer().optional(),
    DPHistRelance: Joi.string().optional().allow(""),
});

export const updateDataProviderSchema = Joi.object({
    StateID: Joi.number().integer().optional(),
    DPTypeContact: Joi.number().integer().optional(),
    DPOrgName: Joi.string().max(255).optional().allow(""),
    DPName: Joi.string().max(150).optional().allow(""),
    DPStreet: Joi.string().max(255).optional().allow(""),
    DPCity: Joi.string().max(150).optional().allow(""),
    DPProvince: Joi.string().max(150).optional().allow(""),
    DPPostCode: Joi.string().max(50).optional().allow(""),
    DPEMail: Joi.string().email().max(150).optional(),
    DPEMailCopie: Joi.string().email().max(150).optional().allow(""),
    DPStatus: Joi.number().integer().min(0).max(6).optional(),
    DPFlag: Joi.number().integer().optional(),
    DPDateEnvoi: Joi.number().integer().optional(),
    DPDateRelance: Joi.number().integer().optional(),
    DPDateLimite: Joi.number().integer().optional(),
    DPDateRetour: Joi.number().integer().optional(),
    DPDateValid: Joi.number().integer().optional(),
    DPDateAcces: Joi.number().integer().optional(),
    DPDateModif: Joi.number().integer().optional(),
    DPHistRelance: Joi.string().optional().allow(""),
}).min(1).messages({
    "object.min": "At least one field must be provided to update",
});

export const generateTokenSchema = Joi.object({
    email: Joi.string().email().required(),
});

export const submitUpdateSchema = Joi.object({
    OrgName: Joi.string().max(255).optional(),
    InstNameEnglish: Joi.string().max(255).optional(),
    Street: Joi.string().optional().allow(""),
    City: Joi.string().max(150).optional(),
    Province: Joi.string().max(150).optional().allow(""),
    PostCode: Joi.string().max(50).optional().allow(""),
    Tel: Joi.string().max(100).optional().allow(""),
    Fax: Joi.string().max(100).optional().allow(""),
    WWW: Joi.string().max(255).optional().allow(""),
    iAdmissionRequirements: Joi.string().optional().allow(""),
    iFeesN: Joi.string().max(100).optional().allow(""),
    iFeesI: Joi.string().max(100).optional().allow(""),
    iLanguagesUsed: Joi.string().max(255).optional().allow(""),
    iAccreditingAgency: Joi.string().max(255).optional().allow(""),
}).min(1).messages({
    "object.min": "At least one profile field must be updated",
});

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
