const urlService = require('../services/url.service');

const createUrl = async (req, res, next) => {
    try {
        const url = await urlService.createUrl(req)
        return res.json({ url })
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const getUrlByAlias = async (req, res, next) => {
    try {
        const url = await urlService.getUrlByAlias(req)
        return res.redirect(url?.long_url);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = { createUrl, getUrlByAlias }