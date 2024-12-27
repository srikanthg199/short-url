const { Analytics } = require("../../models");

const createAnalytic = async (payload) => {
    try {
        return await Analytics.create(payload);
    } catch (error) {
        throw new Error(error);
    }
}

const getAnalytic = async (filter) => {
    try {
        return await Analytics.findOne(filter)
    } catch (error) {
        throw new Error(error);
    }
}


const getAnalytics = async (filter) => {
    try {
        return await Analytics.findAll(filter)
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = { getAnalytic, getAnalytics, createAnalytic };