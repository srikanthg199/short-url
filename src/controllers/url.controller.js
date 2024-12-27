const urlService = require('../services/url.service');

const createUrl = async (req, res, next) => {
    try {
        const url = await urlService.createUrl(req)
        return res.json({ url })
    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { createUrl }