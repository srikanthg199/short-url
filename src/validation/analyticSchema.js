const Joi = require("joi");

const getAnalyticsByAliasSchema = Joi.object({
    alias: Joi.string().required().messages({
        "string.base": "Alias must be a string.",
        "string.empty": "Alias is required.",
        "any.required": "Alias is required.",
    }),
})

const getAnalyticsByTopicSchema = Joi.object({
    topic: Joi.string().required().messages({
        "string.base": "Topic must be a string.",
        "string.empty": "Topic is required.",
        "any.required": "Topic is required.",
    }),
})

module.exports = { getAnalyticsByAliasSchema, getAnalyticsByTopicSchema };