const { Sequelize, Op } = require("sequelize");
const { ShortUrl, Analytics } = require("../../models");
const analyticsRepository = require("../repositories/analytics.repository");
const { redisClient } = require("../utils/redis");

const getAnalyticsByAlias = async (req) => {
    const { alias } = req.params;

    const cacheKey = `analytics:${alias}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const shortUrl = await ShortUrl.findOne({ where: { alias } });

    if (!shortUrl) throw new Error("Short URL not found");

    const analytics = await analyticsRepository.getAnalytics({
        where: { short_url_id: shortUrl.id },
    });

    const totalClicks = analytics.length;
    const uniqueClicks = new Set(analytics.map((a) => a.ip_address)).size;

    // Calculate clicksByDate
    const currentDate = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() - i);
        return date.toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
    });

    const clicksByDate = last7Days.map((date) => {
        const clicks = analytics.filter((a) => a.created_at.toISOString().split("T")[0] === date).length;
        return { date, clicks };
    });


    const osType = analytics.reduce((acc, a) => {
        const os = a.os_name || 'unknown';
        if (!acc[os]) acc[os] = { uniqueClicks: 0, uniqueUsers: new Set() };
        acc[os].uniqueClicks++;
        acc[os].uniqueUsers.add(a.ip_address);
        return acc;
    }, {});

    const deviceType = analytics.reduce((acc, a) => {
        const device = a.device_name || 'unknown';
        if (!acc[device]) acc[device] = { uniqueClicks: 0, uniqueUsers: new Set() };
        acc[device].uniqueClicks++;
        acc[device].uniqueUsers.add(a.ip_address);
        return acc;
    }, {});

    const analyticsData = {
        totalClicks,
        uniqueClicks,
        clicksByDate,
        osType: Object.entries(osType).map(([key, value]) => ({
            osName: key,
            uniqueClicks: value.uniqueClicks,
            uniqueUsers: value.uniqueUsers.size,
        })),
        deviceType: Object.entries(deviceType).map(([key, value]) => ({
            deviceName: key,
            uniqueClicks: value.uniqueClicks,
            uniqueUsers: value.uniqueUsers.size,
        })),
    };

    // Store in cache for future requests (TTL: 10 minutes)
    await redisClient.set(cacheKey, JSON.stringify(analyticsData), { EX: 600 });

    return analyticsData;
}

const testAnalytics = async (req) => {
    const { alias } = req.params;
    const shortUrl = await ShortUrl.findOne({ where: { alias } });

    if (!shortUrl) throw new Error("Short URL not found");

    const analytics = await Analytics.findAll({
        attributes: [
            // Total and Unique Clicks
            [Sequelize.fn("COUNT", Sequelize.col("id")), "totalClicks"],
            [Sequelize.fn("COUNT", Sequelize.fn("DISTINCT", Sequelize.col("ip_address"))), "uniqueClicks"],

            // OS Type Aggregation
            [Sequelize.fn("COUNT", Sequelize.fn("DISTINCT", Sequelize.col("os_name"))), "osTypeUniqueClicks"],
            [Sequelize.fn("COUNT", Sequelize.fn("DISTINCT", Sequelize.col("ip_address"))), "osTypeUniqueUsers"],

            // Device Type Aggregation
            [Sequelize.fn("COUNT", Sequelize.fn("DISTINCT", Sequelize.col("device_name"))), "deviceTypeUniqueClicks"],
            [Sequelize.fn("COUNT", Sequelize.fn("DISTINCT", Sequelize.col("ip_address"))), "deviceTypeUniqueUsers"],

            // Include os_name and device_name
            "os_name",
            "device_name"
        ],
        where: {
            short_url_id: shortUrl.id,
        },
        group: [
            "os_name",
            "device_name"
        ],
        raw: true,
    });

    // Get totalClicks and uniqueClicks (same as before)
    const totalClicks = analytics.reduce((sum, row) => sum + (+row.clickCount || 0), 0);
    const uniqueClicks = analytics.reduce((sum, row) => sum + (+row.uniqueClicks || 0), 0);

    // Process OS Stats (aggregated)
    const osStats = analytics.map(row => ({
        osName: row.os_name, // Add os_name to the result
        uniqueClicks: +row.osTypeUniqueClicks || 0,
        uniqueUsers: +row.osTypeUniqueUsers || 0
    }));

    // Process Device Stats (aggregated)
    const deviceStats = analytics.map(row => ({
        deviceName: row.device_name, // Add device_name to the result
        uniqueClicks: +row.deviceTypeUniqueClicks || 0,
        uniqueUsers: +row.deviceTypeUniqueUsers || 0
    }));

    return {
        totalClicks,
        uniqueClicks,
        // clicksByDate, 
        osStats,
        deviceStats,
    };
}

const getAnalyticsByTopic = async (req) => {
    const { topic } = req.params;
    const shortUrls = await ShortUrl.findAll({ where: { topic } });

    if (!shortUrls.length) throw new Error("No short URLs found for this topic");

    // Initialize variables to store total clicks, unique clicks, and clicksByDate
    let totalClicks = 0;
    let uniqueClicksSet = new Set();
    let clicksByDate = [];
    const urls = [];

    // Iterate over each short URL to gather analytics
    await Promise.all(shortUrls.map(async (shortUrl) => {
        // Fetch analytics for each short URL
        const analytics = await analyticsRepository.getAnalytics({
            where: { short_url_id: shortUrl.id },
        });

        const urlTotalClicks = analytics.length;
        const uniqueIps = new Set(analytics.map((a) => a.ip_address));
        const urlUniqueClicks = uniqueIps.size;

        // Add the URL data to the urls array
        urls.push({
            shortUrl: shortUrl.alias,
            totalClicks: urlTotalClicks,
            uniqueClicks: urlUniqueClicks,
        });

        // Update totalClicks and uniqueClicks across all URLs
        totalClicks += urlTotalClicks;
        uniqueClicksSet = new Set([...uniqueClicksSet, ...uniqueIps]);

        // Aggregate clicks by date
        analytics.forEach((a) => {
            const date = a.created_at.toISOString().split('T')[0];
            const clickCount = 1;

            const existing = clicksByDate.find(item => item.date === date);
            if (existing) {
                existing.clickCount += clickCount;
            } else {
                clicksByDate.push({ date, clickCount });
            }
        });
    }));

    return {
        totalClicks,
        uniqueClicks: uniqueClicksSet.size,
        clicksByDate,
        urls,
    };
}

const getOverallAnalytics = async (req) => {
    // const { user } = req;
    console.log(/u/, req.user);

    const userUrls = await ShortUrl.findAll({ where: { created_by: req.user.id } }); //Dynamic

    // Get analytics for all short URLs created by the user
    const analytics = await Analytics.findAll({
        where: {
            short_url_id: { [Op.in]: userUrls.map(url => url.id) }
        },
        attributes: [
            [Sequelize.fn("COUNT", Sequelize.col("id")), "totalClicks"],
            [Sequelize.fn("COUNT", Sequelize.fn("DISTINCT", Sequelize.col("ip_address"))), "uniqueClicks"],
            [Sequelize.fn("DATE", Sequelize.col("created_at")), "date"],
            "os_name",
            "device_name"
        ],
        group: [
            "date",
            "os_name",
            "device_name"
        ],
        raw: true,
    });
    // Calculate total number of short URLs
    const totalUrls = userUrls.length;

    // Calculate total clicks and unique clicks
    const totalClicks = analytics.reduce((sum, row) => sum + (+row.totalClicks || 0), 0);
    const uniqueClicks = new Set(analytics.map(row => row.ip_address)).size;

    // Aggregate clicks by date
    const clicksByDate = analytics.reduce((acc, row) => {
        const date = row.date;
        if (!acc[date]) {
            acc[date] = { date, clickCount: 0 };
        }
        acc[date].clickCount += +row.totalClicks || 0;
        return acc;
    }, {});

    const clicksByDateArray = Object.values(clicksByDate);

    // Aggregate OS type statistics
    const osType = analytics.reduce((acc, row) => {
        const osName = row.os_name;
        if (!acc[osName]) {
            acc[osName] = { osName, uniqueClicks: 0, uniqueUsers: new Set() };
        }
        acc[osName].uniqueClicks += +row.uniqueClicks || 0;
        acc[osName].uniqueUsers.add(row.ip_address);
        return acc;
    }, {});

    const osTypeArray = Object.values(osType).map(os => ({
        osName: os.osName,
        uniqueClicks: os.uniqueClicks,
        uniqueUsers: os.uniqueUsers.size
    }));

    // Aggregate device type statistics
    const deviceType = analytics.reduce((acc, row) => {
        const deviceName = row.device_name;
        if (!acc[deviceName]) {
            acc[deviceName] = { deviceName, uniqueClicks: 0, uniqueUsers: new Set() };
        }
        acc[deviceName].uniqueClicks += +row.uniqueClicks || 0;
        acc[deviceName].uniqueUsers.add(row.ip_address);
        return acc;
    }, {});

    const deviceTypeArray = Object.values(deviceType).map(device => ({
        deviceName: device.deviceName,
        uniqueClicks: device.uniqueClicks,
        uniqueUsers: device.uniqueUsers.size
    }));

    return {
        totalUrls,
        totalClicks,
        uniqueClicks,
        clicksByDate: clicksByDateArray,
        osType: osTypeArray,
        deviceType: deviceTypeArray
    };
}

module.exports = { getAnalyticsByAlias, getAnalyticsByTopic, getOverallAnalytics, testAnalytics, };