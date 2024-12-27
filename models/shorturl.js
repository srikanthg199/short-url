module.exports = (sequelize, Sequelize) => {
  return sequelize.define("short_urls", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    alias: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    long_url: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    topic: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    created_by: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  },
    {
      timestamps: true,
      createdAt: "created_at", // alias createdAt
      updatedAt: "updated_at", // alias updatedAt
    });
};