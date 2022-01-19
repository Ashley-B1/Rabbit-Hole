'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Posts', [
    {userId: 'John Doe', isBetaMember: false},




], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Posts', null, {})
};
