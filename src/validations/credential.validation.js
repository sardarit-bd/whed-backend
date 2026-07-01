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
    StateID: Joi.number().integer().optional(),
    Cred: Joi.string().max(255).optional(),
    cDescription: Joi.string().optional().allow(""),
    cAcronym: Joi.string().max(50).optional().allow(""),
    cEntryExamNational: Joi.string().max(5).optional().allow(""),
    cEntryExamInst: Joi.string().max(5).optional().allow(""),
    CredLevelCode: Joi.string().max(10).optional().allow(""),
}).min(1).messages({
    "object.min": "At least one field must be provided to update",
});

export const prerequisiteSchema = Joi.object({
    requiredCredIds: Joi.array().items(Joi.number().integer()).required().messages({
        "array.base": "requiredCredIds must be an array of credential IDs",
        "any.required": "requiredCredIds array is required",
    }),
});

export const instTypeLinkSchema = Joi.object({
    instTypeIds: Joi.array().items(Joi.number().integer()).required().messages({
        "array.base": "instTypeIds must be an array of institution type IDs",
        "any.required": "instTypeIds array is required",
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
