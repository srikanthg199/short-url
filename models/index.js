const Sequelize = require("sequelize");
const dbConfig = require("../config/config").development
// DB Connection
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

module.exports = db;
