'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Follows', [
      { userId: 2, followerId: 3, createdAt: new Date()},
      { userId: 2, followerId: 4, createdAt: new Date()},
      { userId: 3, followerId: 4, createdAt: new Date()},
      { userId: 3, followerId: 2, createdAt: new Date()},
      { userId: 4, followerId: 2, createdAt: new Date()},
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Follows', null, {})
};
