require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Sequelize = require("sequelize");
const dbConfig = require("../config/config").development

// // Read the certificate file
// const sslCert = fs.readFileSync(path.resolve(__dirname, '../ca.pem'));
// const dbUrl = process.env.DB_URL

// const sequelize = new Sequelize(dbUrl, {
//   dialectOptions: {
//     ssl: {
//       ca: sslCert, // Pass the certificate to the connection
//       require: true, // Ensure SSL is used
//       rejectUnauthorized: true // Enforce certificate validation
//     }
//   }
// });
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: false,
  }
);

const db = {
  Sequelize,
  sequelize,
};

db.User = require("./user")(sequelize, Sequelize);
db.ShortUrl = require("./shorturl")(sequelize, Sequelize);
db.Analytics = require("./analytics")(sequelize, Sequelize);
db.ShortUrl.hasMany(db.Analytics, { foreignKey: "short_url_id", sourceKey: "id", as: "Analytics" });

module.exports = db;
