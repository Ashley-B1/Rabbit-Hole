'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Follows', [
      { name: 'John Doe', isBetaMember: false},
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Follows', null, {})
};
