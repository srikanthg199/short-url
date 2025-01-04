// src/utils/redisClient.js
const { createClient } = require('redis');

const redisClient = createClient({
    username: process.env.REDIS_USERNAME || 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT || 6379,
    },
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

const connectRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
            // console.log('Connected to Redis successfully');
        }
    } catch (err) {
        console.error('Failed to connect to Redis:', err);
        process.exit(1); // Exit the application if Redis fails to connect
    }
};

module.exports = { redisClient, connectRedis };
