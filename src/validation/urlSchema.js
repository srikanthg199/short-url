const Joi = require("joi");

const createUrlSchema = Joi.object({
    longUrl: Joi.string().uri().required().messages({
        "string.base": "Long URL must be a string.",
        "string.uri": "Long URL must be a valid URI.",
        "string.empty": "Long URL is required.",
        "any.required": "Long URL is required.",
    }),
    customAlias: Joi.optional(),
    topic: Joi.string().required().messages({
        "string.base": "Topic must be a string.",
        "string.empty": "Topic is required.",
        "any.required": "Topic is required.",
    }),
});

const getUrlByAliasSchema = Joi.object({
    alias: Joi.string().required().messages({
        "string.base": "Alias must be a string.",
        "string.empty": "Alias is required.",
        "any.required": "Alias is required.",
    }),
})

module.exports = { createUrlSchema, getUrlByAliasSchema };
