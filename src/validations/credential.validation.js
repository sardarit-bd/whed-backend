import Joi from "joi";

export const credentialSchema = Joi.object({
    StateID: Joi.number().integer().required().messages({
        "number.base": "StateID must be a number",
        "any.required": "StateID is required",
    }),
    Cred: Joi.string().max(255).required().messages({
        "string.empty": "Credential name is required",
        "string.max": "Credential name cannot exceed 255 characters",
    })
});

export const updateCredentialSchema = Joi.object({
    Cred: Joi.string().max(255).optional(),
    cAcronym: Joi.string().max(50).optional().allow(""),
    CredCatCode1: Joi.string().max(10).optional().allow(""),
    CredCatCode2: Joi.string().max(10).optional().allow(""),
    CredlevelCode: Joi.string().max(10).optional().allow(""),
    cDescription: Joi.string().optional().allow(""),
    cAlternativeQualification: Joi.string().optional().allow(""),
    cEntryExamNational: Joi.number().max(5).optional().allow(null),
    cEntryExamInst: Joi.number().max(5).optional().allow(null),
}).min(1).messages({
    "object.min": "At least one field must be provided to update",
});

export const prerequisiteSchema = Joi.object({
    CredID_Req: Joi.number().integer().required().messages({
        "any.required": "CredID_Req Number is required",
    }),
});

export const instTypeLinkSchema = Joi.object({
    instTypeIds: Joi.number().integer().required().messages({
        "any.required": "instTypeIds Number is required",
    }),
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
