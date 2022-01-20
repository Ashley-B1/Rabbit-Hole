'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Users', [
      {
        userName: 'Demo',
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@user.com',
        password: 'mediumpassword',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { userName: 'Tom8-o',
        firstName: 'Thomas',
        lastName: 'Aytoe',
        email: 'tom8o@anthropomorphicVeg.org',
        password: 'iAmFruit',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { userName: 'waitWhoAmIAgain',
      firstName: 'Finding',
      lastName: 'Dorian',
      email: 'dory@worldwildlifefund.org',
      password: 'PSherman42WallabyWay',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { userName: 'thirdGhastlySonOfCharlesDickens',
      firstName: 'Gustov',
      lastName: 'ChristmasPast',
      email: 'gcpchristmasCarol@booksTheyMadeIntoMovies.com',
      password: 'Carol1843',
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {})
};
