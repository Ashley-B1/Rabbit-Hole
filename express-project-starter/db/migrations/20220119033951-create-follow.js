'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Follows', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    userId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: { model: 'Users'}
    },
    followerId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: { model: 'Users'}
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      type: Sequelize.DATE
    }
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('UserFollows')
};
