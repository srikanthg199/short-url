'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addIndex('analytics', ['os_name'])
    await queryInterface.addIndex('analytics', ['device_name'])
    await queryInterface.addIndex('analytics', ['created_at'])
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('analytics', ['os_name']);
    await queryInterface.removeIndex('analytics', ['device_name']);
    await queryInterface.removeIndex('analytics', ['created_at']);
  }
};