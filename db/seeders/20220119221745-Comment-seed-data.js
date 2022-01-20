'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Comments', [
      { userId: 1,
        postId: 2,
        content: 'I am a demo user, I am hard coded by humans. I hope I do not have any bugs.',
        createdAt: new Date(),
      },
      { userId: 2,
        postId: 3,
        content: 'I can totally relate to that. I run into hardware issues when Dale turns the sprinklers turn on.',
        createdAt: new Date(),
      },
      { userId: 3,
        postId: 4,
        content: 'I don\'t just forget who my pair is. I forget who I am.',
        createdAt: new Date(),
      },
      { userId: 4,
        postId: 1,
        content: 'Hi, demo user! I prefer to not think about the future.',
        createdAt: new Date(),
      },
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Comments', null, {})
};
