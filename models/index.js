const fs = require('fs');
const path = require('path');
const Sequelize = require("sequelize");
require('dotenv').config();

// Read the certificate file
const sslCert = fs.readFileSync(path.resolve(__dirname, '../ca.pem'));
const dbUrl = process.env.DB_URL

const sequelize = new Sequelize(dbUrl, {
  dialectOptions: {
    ssl: {
      ca: sslCert, // Pass the certificate to the connection
      require: true, // Ensure SSL is used
      rejectUnauthorized: true // Enforce certificate validation
    }
  }
});



const db = {
  Sequelize,
  sequelize,
};

db.User = require("./user")(sequelize, Sequelize);
db.ShortUrl = require("./shorturl")(sequelize, Sequelize);
db.Analytics = require("./analytics")(sequelize, Sequelize);
db.ShortUrl.hasMany(db.Analytics, { foreignKey: "short_url_id", sourceKey: "id", as: "Analytics" });

module.exports = db;
