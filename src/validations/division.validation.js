import Joi from "joi";

export const divisionSchema = Joi.object({
    OrgID: Joi.number().integer().required().messages({
        "number.base": "OrgID must be a number",
        "any.required": "OrgID is required",
    }),
    iDivision: Joi.string().max(255).required().messages({
        "string.empty": "Division name is required",
        "string.max": "Division name cannot exceed 255 characters",
    }),
    iDivisionTypeCode: Joi.string().max(10).optional().allow(""),
    iMoreDetails: Joi.string().optional().allow(""),
});

export const updateDivisionSchema = Joi.object({
    OrgID: Joi.number().integer().optional(),
    iDivision: Joi.string().max(255).optional(),
    iDivisionTypeCode: Joi.string().max(10).optional().allow(""),
    iMoreDetails: Joi.string().optional().allow(""),
}).min(1).messages({
    "object.min": "At least one field must be provided to update",
});

export const divisionFosSchema = Joi.object({
    fosCodes: Joi.array().items(Joi.string().max(10)).required().messages({
        "array.base": "fosCodes must be an array of field of study codes",
        "any.required": "fosCodes array is required",
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
