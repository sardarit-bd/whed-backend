import Joi from "joi";

/************** Create State Schema ****************/
export const stateSchema = Joi.object({
    Country: Joi.string().max(40).required().messages({
        "string.base": "Country name must be a text",
        "string.empty": "Country name is required",
        "string.max": "Country name cannot exceed 40 characters",
        "any.required": "Country name is required",
    }),
    State: Joi.string().max(50).required().messages({
        "string.base": "State name must be a text",
        "string.empty": "State name is required",
        "string.max": "State name cannot exceed 50 characters",
        "any.required": "State name is required",
    }),
    CountryCode: Joi.string().max(2).optional().allow("").messages({
        "string.max": "Country Code cannot exceed 2 characters",
    }),
    StateCode: Joi.string().max(2).optional().allow("").messages({
        "string.max": "State Code cannot exceed 2 characters",
    }),
    StateAlpha: Joi.string().max(2).optional().allow("").messages({
        "string.max": "State Alpha code cannot exceed 2 characters",
    }),
    ProxyStateID: Joi.number().integer().optional().messages({
        "number.base": "Proxy State ID must be a number",
    }),
    Palgrave: Joi.number().integer().optional().default(1),
    UseCountryCreds: Joi.number().integer().optional().default(0),
    EdSysLocked: Joi.number().integer().optional().default(0),
    InstLocked: Joi.number().integer().optional().default(0),
    Stub: Joi.number().integer().optional().default(0),
    CredLocked: Joi.number().integer().optional().default(0),
    Regions: Joi.string().optional().allow(""),
    ISO3: Joi.string().max(3).optional().allow("").messages({
        "string.max": "ISO3 country code cannot exceed 3 characters",
    }),
});

/************** Update State Schema ****************/
export const updateStateSchema = Joi.object({
    Country: Joi.string().max(40).optional().messages({
        "string.max": "Country name cannot exceed 40 characters",
    }),
    State: Joi.string().max(50).optional().messages({
        "string.max": "State name cannot exceed 50 characters",
    }),
    CountryCode: Joi.string().max(2).optional().allow(""),
    StateCode: Joi.string().max(2).optional().allow(""),
    StateAlpha: Joi.string().max(2).optional().allow(""),
    ProxyStateID: Joi.number().integer().optional(),
    Palgrave: Joi.number().integer().optional(),
    UseCountryCreds: Joi.number().integer().optional(),
    EdSysLocked: Joi.number().integer().optional(),
    InstLocked: Joi.number().integer().optional(),
    Stub: Joi.number().integer().optional(),
    CredLocked: Joi.number().integer().optional(),
    Regions: Joi.string().optional().allow(""),
    ISO3: Joi.string().max(3).optional().allow(""),
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
