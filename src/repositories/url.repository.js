const { ShortUrl } = require("../../models");

const getUrl = async (filter) => {
    try {
        return await ShortUrl.findOne(filter)
    } catch (error) {
        throw new Error(error);
    }
}

const createUrl = async (UrlPayload) => {
    try {
        return await ShortUrl.create(UrlPayload);
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = { createUrl, getUrl };