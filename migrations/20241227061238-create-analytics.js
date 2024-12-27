'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('analytics', {
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
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('analytics');
  }
};