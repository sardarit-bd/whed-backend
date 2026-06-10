import Joi from "joi";

export const logHitSchema = Joi.object({
    pageType: Joi.string().max(100).required(),
    targetId: Joi.string().max(50).required(),
    ficheName: Joi.string().max(255).optional().allow(""),
});

export const statsQuerySchema = Joi.object({
    year: Joi.number().integer().min(2020).max(2100).optional().default(new Date().getFullYear()),
    userId: Joi.number().integer().optional(),
    page: Joi.string().optional().allow(""),
});

export const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
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

    req.validatedQuery = value;
    next();
};
