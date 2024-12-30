require('dotenv').config();
const fs = require('fs');
const path = require('path');

module.exports = {
    development: {
        url: process.env.DB_URL,  // Ensure this is correctly set
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                ca: fs.readFileSync(path.resolve(__dirname, '../ca.pem')),
                require: true,
                rejectUnauthorized: true
            }
        }
    }
};

