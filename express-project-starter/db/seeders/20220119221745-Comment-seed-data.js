'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Comments', [
      { name: 'John Doe', isBetaMember: false},
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Comments', null, {})
};
