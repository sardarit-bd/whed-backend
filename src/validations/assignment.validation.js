import Joi from "joi";

export const countryAssignmentSchema = Joi.object({
    UserID: Joi.number().integer().required().messages({
        "any.required": "UserID is required",
    }),
    StateID: Joi.number().integer().required().messages({
        "any.required": "StateID is required",
    }),
});

export const institutionAssignmentSchema = Joi.object({
    UserID: Joi.number().integer().required().messages({
        "any.required": "UserID is required",
    }),
    StateID: Joi.number().integer().required().messages({
        "any.required": "StateID is required",
    }),
    Exclusif: Joi.number().integer().optional().default(0),
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
