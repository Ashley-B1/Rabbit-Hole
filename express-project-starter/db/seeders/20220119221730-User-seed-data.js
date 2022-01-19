'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Users', [
      { userName: 'Demo', firstName: 'Demo', lastName: 'User', email: 'demo@user.com', password: 'mediumpassword'},
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {})
};
