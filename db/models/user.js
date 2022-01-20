'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userName: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    hashedPassword: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // User vs Post -- one to many
    User.hasMany( models.Post, {
      as: 'posts',
      foreignKey: 'userId'
    });

    // User vs Comment -- one to many
    User.hasMany( models.Comment, {
      as: 'comments',
      foreignKey: 'userId'
    });

    // User vs PostLike -- one to many
    User.hasMany( models.PostLike, {
      as: 'postlikes',
      foreignKey: 'userId'});

    // User vs Follow  -- many to many (self joining)
    const columnMappingOne = { // User vs User, through Follow as follower
      through: 'Follow',
      otherKey: 'userId',
      foreignKey: 'followerId',
      as: 'followings'
    }

    const columnMappingTwo = {
      through: 'Follow',
      otherKey: 'followerId',
      foreignKey: 'userId',
      as: 'followers'
    }

    User.belongsToMany(models.User, columnMappingOne);
    User.belongsToMany(models.User, columnMappingTwo);

  };
  return User;
};
