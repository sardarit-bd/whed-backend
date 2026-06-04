import Joi from "joi";

const profileSchema = Joi.object({
    userId: Joi.string().required(),
    email: Joi.string().email().required(),
    firstName: Joi.string().min(3).max(50).optional(),
    Surname: Joi.string().min(3).max(50).optional(),
    role: Joi.string().min(3).max(50).required(),
    status: Joi.string().valid("active", "inactive").optional(),
    workingLanguage: Joi.string().min(2).max(50).optional(),
});

export default profileSchema;
