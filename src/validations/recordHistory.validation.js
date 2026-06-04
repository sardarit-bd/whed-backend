import Joi from "joi";

const recordHistorySchema = Joi.object({
    instituteId: Joi.string().required(),
    userId: Joi.string().required(),
    name: Joi.string().min(3).max(100).rquired(),
    role: Joi.string().min(3).max(100).required(),
    fieldName: Joi.string().min(3).max(100).required(),
    oldValue: Joi.string().optional(),
    newValue: Joi.string().optional(),
    dateAndTime: Joi.date().required(),
    action: Joi.string().valid("Created", "Updated", "Deleted").required(),
});

export default recordHistorySchema;
