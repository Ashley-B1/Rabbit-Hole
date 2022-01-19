'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('PostLikes', [
      { name: 'John Doe', isBetaMember: false},
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('PostLikes', null, {})
};
