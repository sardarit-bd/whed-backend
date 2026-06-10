import Joi from "joi";

/************** Update User Schema ****************/
export const updateUserSchema = Joi.object({
    login: Joi.string().min(3).max(60).optional().messages({
        "string.min": "Login must be at least 3 characters long",
        "string.max": "Login cannot exceed 60 characters",
    }),
    pass: Joi.string().min(8).max(255).optional().messages({
        "string.min": "Password must be at least 8 characters long",
        "string.max": "Password cannot exceed 255 characters",
    }),
    mail: Joi.string().email({ tlds: { allow: false } }).max(64).optional().messages({
        "string.email": "Email must be a valid email address",
        "string.max": "Email cannot exceed 64 characters",
    }),
    nom: Joi.string().min(2).max(100).optional().messages({
        "string.min": "Last name must be at least 2 characters long",
        "string.max": "Last name cannot exceed 100 characters",
    }),
    prenom: Joi.string().min(2).max(100).optional().messages({
        "string.min": "First name must be at least 2 characters long",
        "string.max": "First name cannot exceed 100 characters",
    }),
    organisme: Joi.string().max(100).optional().allow(""),
    role: Joi.number().integer().optional(),
    status: Joi.number().integer().optional(),
    language: Joi.string().max(2).optional().allow(""),
    adresse: Joi.string().max(5000).optional().allow(""),
    cp: Joi.string().max(30).optional().allow(""),
    ville: Joi.string().max(100).optional().allow(""),
    pays: Joi.string().max(100).optional().allow(""),
    tel: Joi.string().max(50).optional().allow(""),
    fax: Joi.string().max(50).optional().allow(""),
    web: Joi.string().uri({ scheme: ["http", "https"] }).max(100).optional().allow("").messages({
        "string.uri": "Website must be a valid URL (http or https)",
    }),
    titre: Joi.string().max(100).optional().allow(""),
    fonction: Joi.string().max(100).optional().allow(""),
}).min(1).messages({
    "object.min": "At least one field must be provided to update",
});


/************** Validation Middleware Helper  ****************/
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
