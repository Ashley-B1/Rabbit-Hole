'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('PostLikes', [
      { userId: 2,
        postId: 1,
        createdAt: new Date(),
      },
      { userId: 3,
        postId: 1,
        createdAt: new Date(),
      },
      { userId: 2,
        postId: 3,
        createdAt: new Date(),
      },
      { userId: 2,
        postId: 4,
        createdAt: new Date(),
      },
      { userId: 3,
        postId: 4,
        createdAt: new Date(),
      },
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('PostLikes', null, {})
};
