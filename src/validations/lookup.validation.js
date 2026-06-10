import Joi from "joi";

export const instTypeSchema = Joi.object({
    StateID: Joi.number().integer().required(),
    sInstTypeSort: Joi.number().integer().optional().default(1),
    sInstType: Joi.string().max(255).required(),
    sInstTypeEnglish: Joi.string().max(255).optional().allow(""),
    sInstTypeDescription: Joi.string().optional().allow(""),
});

export const updateInstTypeSchema = Joi.object({
    StateID: Joi.number().integer().optional(),
    sInstTypeSort: Joi.number().integer().optional(),
    sInstType: Joi.string().max(255).optional(),
    sInstTypeEnglish: Joi.string().max(255).optional().allow(""),
    sInstTypeDescription: Joi.string().optional().allow(""),
}).min(1);

export const languageSchema = Joi.object({
    LanguageCode: Joi.string().max(10).required(),
    Language: Joi.string().max(150).required(),
});

export const stateLanguageLinkSchema = Joi.object({
    LanguageCode: Joi.string().max(10).required(),
    LanguageSort: Joi.number().integer().optional().default(1),
});

export const stageSchema = Joi.object({
    StageCode: Joi.string().max(10).required(),
    Stage: Joi.string().max(150).required(),
});

export const stateStageLinkSchema = Joi.object({
    StageCode: Joi.string().max(10).required(),
    sStageName: Joi.string().max(255).optional().allow(""),
    sStageDescription: Joi.string().optional().allow(""),
});

export const fosSchema = Joi.object({
    FOSCode: Joi.string().max(10).required(),
    FOSDisplay: Joi.string().max(255).required(),
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
