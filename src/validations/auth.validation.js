import Joi from "joi";

/************** Register Schema  ****************/
export const registerSchema = Joi.object({
    
    // --- Baddhotamulok (Required) Fields ---
    login: Joi.string().min(3).max(60).required().messages({
        "string.base": "Login must be a text",
        "string.empty": "Login is required",
        "string.min": "Login must be at least 3 characters long",
        "string.max": "Login cannot exceed 60 characters",
        "any.required": "Login is required",
    }),

    pass: Joi.string().min(8).max(255).required().messages({
        "string.base": "Password must be a text",
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
        "string.max": "Password cannot exceed 255 characters",
        "any.required": "Password is required",
    }),

    mail: Joi.string().email({ tlds: { allow: false } }).max(64).required().messages({
        "string.email": "Email must be a valid email address",
        "string.empty": "Email is required",
        "string.max": "Email cannot exceed 64 characters",
        "any.required": "Email is required",
    }),

    nom: Joi.string().min(2).max(100).required().messages({
        "string.base": "Last name must be a text",
        "string.empty": "Last name is required",
        "string.min": "Last name must be at least 2 characters long",
        "string.max": "Last name cannot exceed 100 characters",
        "any.required": "Last name is required",
    }),

    prenom: Joi.string().min(2).max(100).required().messages({
        "string.base": "First name must be a text",
        "string.empty": "First name is required",
        "string.min": "First name must be at least 2 characters long",
        "string.max": "First name cannot exceed 100 characters",
        "any.required": "First name is required",
    }),

    organisme: Joi.string().max(100).required().messages({
        "string.max": "Organisation name cannot exceed 100 characters",
        "any.required": "Organisation is required",
    }),

    // --- Database Default value thaka Fields (Optional kora holo) ---
    role: Joi.number().integer().optional().default(0).messages({
        "number.base": "Role must be a numeric value",
    }),

    status: Joi.number().integer().optional().default(0).messages({
        "number.base": "Status must be a numeric value",
    }),

    language: Joi.string().max(2).optional().default("en").messages({
        "string.max": "Language code cannot exceed 2 characters",
    }),

    // --- Optional Fields (Faka string allow kora ache database error arakte) ---
    adresse: Joi.string().max(5000).optional().allow("").default(""),
    cp: Joi.string().max(30).optional().allow("").default(""),
    ville: Joi.string().max(100).optional().allow("").default(""),
    pays: Joi.string().max(100).optional().allow("").default(""),
    tel: Joi.string().max(50).optional().allow("").default(""),
    fax: Joi.string().max(50).optional().allow("").default(""),

    web: Joi.string().uri({ scheme: ["http", "https"] }).max(100).optional().allow("").default("").messages({
        "string.uri": "Website must be a valid URL (http or https)",
        "string.max": "Website URL cannot exceed 100 characters"
    }),

    titre: Joi.string().max(100).optional().allow("").default(""),
    fonction: Joi.string().max(100).optional().allow("").default(""),
});


/************** Login Schema  ****************/
export const loginSchema = Joi.object({
    login: Joi.string().max(60).required().messages({
        "string.empty": "Login is required",
        "any.required": "Login is required",
    }),

    pass: Joi.string().max(255).required().messages({
        "string.empty": "Password is required",
        "any.required": "Password is required",
    }),
});


/************** Password Reset Request Schema  ****************/
export const resetPassRequestSchema = Joi.object({
    mail: Joi.string().email({ tlds: { allow: false } }).max(64).required().messages({
        "string.email": "Please provide a valid email address",
        "string.empty": "Email is required",
        "any.required": "Email is required",
    }),
});


/************** Password Reset (with token) Schema  ****************/
export const resetPassSchema = Joi.object({
    // Based on int(10) in database
    reset_pass: Joi.number().integer().required().messages({
        "number.base": "Reset token must be a number",
        "any.required": "Reset token is required",
    }),

    new_pass: Joi.string().min(8).max(255).required().messages({
        "string.empty": "New password is required",
        "string.min": "New password must be at least 8 characters long",
        "string.max": "New password cannot exceed 255 characters",
        "any.required": "New password is required",
    }),

    confirm_pass: Joi.any()
        .valid(Joi.ref("new_pass"))
        .required()
        .messages({
            "any.only": "Passwords do not match",
            "any.required": "Password confirmation is required",
        }),
});


/************** Change Password Schema (logged-in user)  ****************/
export const changePasswordSchema = Joi.object({
    current_pass: Joi.string().max(255).required().messages({
        "string.empty": "Current password is required",
        "any.required": "Current password is required",
    }),

    new_pass: Joi.string().min(8).max(255).required().messages({
        "string.empty": "New password is required",
        "string.min": "New password must be at least 8 characters long",
        "string.max": "New password cannot exceed 255 characters",
        "any.required": "New password is required",
    }),

    confirm_pass: Joi.any()
        .valid(Joi.ref("new_pass"))
        .required()
        .messages({
            "any.only": "Passwords do not match",
            "any.required": "Password confirmation is required",
        }),
});


/************** Update Profile Schema  ****************/
export const updateProfileSchema = Joi.object({
    nom: Joi.string().min(2).max(100).optional(),
    prenom: Joi.string().min(2).max(100).optional(),
    mail: Joi.string().email({ tlds: { allow: false } }).max(64).optional(),
    language: Joi.string().max(2).optional().allow(""),
    organisme: Joi.string().max(100).optional().allow(""),
    adresse: Joi.string().max(5000).optional().allow(""),
    cp: Joi.string().max(30).optional().allow(""),
    ville: Joi.string().max(100).optional().allow(""),
    pays: Joi.string().max(100).optional().allow(""),
    tel: Joi.string().max(50).optional().allow(""),
    fax: Joi.string().max(50).optional().allow(""),
    web: Joi.string().uri({ scheme: ["http", "https"] }).max(100).optional().allow(""),
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
