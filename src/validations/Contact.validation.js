import Joi from "joi";

const contactSchema = Joi.object({
    OrgID: Joi.number().integer().required().messages({
        "number.base": "OrgID must be a number",
        "any.required": "OrgID is required",
    }),

    FirstName: Joi.string().max(60).required().messages({
        "string.empty": "First name is required",
        "string.max": "First name cannot exceed 60 characters",
        "any.required": "First name is required",
    }),

    Surname: Joi.string().max(60).required().messages({
        "string.empty": "Surname is required",
        "string.max": "Surname cannot exceed 60 characters",
        "any.required": "Surname is required",
    }),

    JobTitle: Joi.string().max(100).optional().allow(""),

    JobFunctionCode: Joi.string().max(2).optional().allow(""),

    YearsOfOffice: Joi.string().max(45).optional().allow(""),

    ContactTel: Joi.string().max(60).optional().allow(""),

    ContactEMail: Joi.string().email().max(100).optional().allow("").messages({
        "string.email": "Invalid contact email format",
    }),

    Sex: Joi.string().max(1).optional().allow(""),
});


export const updateContactSchema = Joi.object({
    OrgID: Joi.number().integer().optional(),
    JobTitle: Joi.string().max(255).optional().allow(""),
    FirstName: Joi.string().max(150).optional().allow(""),
    Surname: Joi.string().max(150).optional().allow(""),
    Sex: Joi.string().max(2).optional().allow(""),
    JobFunctionCode: Joi.string().max(10).optional().allow(""),
    ContactEMail: Joi.string().email().max(150).optional().allow(""),
    EMail: Joi.string().email().max(150).optional().allow(""),
}).min(1).messages({
    "object.min": "At least one field must be provided to update",
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

export default contactSchema;
