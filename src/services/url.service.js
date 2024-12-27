const urlRepository = require("../repositories/url.repository");
const { generateUniqueAlias } = require("../utils/generateAlias");
const analyticsRepository = require("../repositories/analytics.repository");

const createUrl = async (req) => {
    const { longUrl, customAlias, topic } = req.body;
    console.log(/c/, customAlias);
    if (customAlias) {
        const existingUrl = await urlRepository.getUrl({ where: { alias: customAlias } });
        if (existingUrl) {
            throw Error("Alias already in use");
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

const getUrlByAlias = async (req) => {
    const { alias } = req.params;
    const url = await urlRepository.getUrl({ where: { alias } });
    if (!url) {
        throw new Error("Url not found");
    }

    // Log analytics
    const { osName, deviceName, ipAddress } = req.analytics;
    const newAnalytics = {
        short_url_id: url.id,
        ip_address: ipAddress,
        os_name: osName,
        device_name: deviceName,
    }
    await analyticsRepository.createAnalytic(newAnalytics);
    return url;
}

module.exports = { createUrl, getUrlByAlias }