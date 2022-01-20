'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Users', [
      {
        userName: 'Demo',
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@user.com',
        hashedPassword: bcrypt.hashSync('mediumpassword'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { userName: 'Tom8-o',
        firstName: 'Thomas',
        lastName: 'Aytoe',
        email: 'tom8o@anthropomorphicVeg.org',
        hashedPassword: bcrypt.hashSync('iAmFruit'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { userName: 'waitWhoAmIAgain',
      firstName: 'Finding',
      lastName: 'Dorian',
      email: 'dory@worldwildlifefund.org',
      hashedPassword: bcrypt.hashSync('PSherman42WallabyWay'),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    { userName: 'thirdGhastlySonOfCharlesDickens',
      firstName: 'Gustov',
      lastName: 'ChristmasPast',
      email: 'gcpchristmasCarol@booksTheyMadeIntoMovies.com',
      hashedPassword: bcrypt.hashSync('Carol1843'),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {})
};
