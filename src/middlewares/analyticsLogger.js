// middleware/analyticsLogger.js
const parser = require('ua-parser-js');

exports.logAnalytics = (req, res, next) => {
    const userAgent = parser(req.headers['user-agent']);
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    req.analytics = {
        osName: userAgent.os.name || 'unknown',
        deviceName: userAgent.device.type || 'unknown',
        ipAddress
    };
    next();
};
