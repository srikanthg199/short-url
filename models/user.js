module.exports = (sequelize, Sequelize) => {
  return sequelize.define("users", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    full_name: {
      type: Sequelize.STRING(100),
    },
    email: {
      type: Sequelize.STRING(120),
      unique: true
    },
    google_id: {
      type: Sequelize.STRING,
    },
  },
    {
      timestamps: true,
      createdAt: "created_at", // alias createdAt
      updatedAt: "updated_at", // alias updatedAt
    });
};