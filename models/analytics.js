module.exports = (sequelize, Sequelize) => {
  return sequelize.define("analytics", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    short_url_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'short_urls', key: 'id' },
    },
    ip_address: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    os_name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    device_name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
    {
      timestamps: true,
      createdAt: "created_at", // alias createdAt
      updatedAt: "updated_at", // alias updatedAt
    });
};