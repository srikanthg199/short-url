const analyticsService = require("../services/analytics.service");
const getAnalyticsByAlias = async (req, res, next) => {
    try {
        // const analytics = await analyticsService.getAnalyticsByAlias(req)
        const analytics = await analyticsService.getAnalyticsByAlias(req)
        return res.json({ analytics })
    } catch (error) {
        next(error);
    }
}

const getAnalyticsByTopic = async (req, res, next) => {
    try {
        const analytics = await analyticsService.getAnalyticsByTopic(req)
        res.json({ analytics })
    } catch (error) {
        next(error);
    }
}

const getOverallAnalytics = async (req, res, next) => {
    try {
        const analytics = await analyticsService.getOverallAnalytics(req)
        res.json({ analytics })
    } catch (error) {
        next(error);
    }
}

module.exports = { getAnalyticsByAlias, getAnalyticsByTopic, getOverallAnalytics }