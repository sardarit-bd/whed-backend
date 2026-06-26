import Joi from "joi";

export const degreeSchema = Joi.object({
    OrgID: Joi.number().integer().required().messages({
        "number.base": "OrgID must be a number",
        "any.required": "OrgID is required",
    }),
    iDegree: Joi.string().max(255).required().messages({
        "string.empty": "Degree name is required",
        "string.max": "Degree name cannot exceed 255 characters",
    }),
    CredID: Joi.number().integer().required().messages({
        "number.base": "CredID must be a number",
        "any.required": "CredID is required",
    }),
    iDegreeOrigine: Joi.string().max(255).optional().allow(""),
    iDegreeNote: Joi.string().optional().allow(""),
});

export const updateDegreeSchema = Joi.object({
    OrgID: Joi.number().integer().optional(),
    iDegree: Joi.string().max(255).optional(),
    CredID: Joi.number().integer().optional(),
    iDegreeOrigine: Joi.string().max(255).optional().allow(""),
    iDegreeNote: Joi.string().optional().allow(""),
}).min(1).messages({
    "object.min": "At least one field must be provided to update",
});

export const degreeFosSchema = Joi.array()
    .items(
        Joi.object({
            iDegreeID: Joi.number().integer().required(),
            FOSCode: Joi.number().integer().required(),
        })
    ).min(1).required();



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
