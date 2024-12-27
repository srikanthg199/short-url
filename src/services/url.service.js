const urlRepository = require("../repositories/url.repository");
const { generateUniqueAlias } = require("../utils/generateAlias");
const createUrl = async (req) => {
    const { longUrl, customAlias, topic } = req.body;
    if (customAlias) {
        const existingUrl = await urlRepository.getUrl({ alias: customAlias });
        if (existingUrl) {
            return res.status(409).json({ message: "Url exist with alias" });
        }
    }
    const shortUrl = customAlias || generateUniqueAlias();
    const newShortUrl = {
        long_url: longUrl,
        alias: shortUrl,
        topic,
        created_by: req?.user?.id || 1,
    };
    const url = await urlRepository.createUrl(newShortUrl)
    return {
        shortUrl: url.alias,
        createdAt: url.created_at,
    };
}

module.exports = { createUrl }