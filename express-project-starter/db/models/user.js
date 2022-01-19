'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userName: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // User vs Post -- one to many
    User.hasMany( models.Post, { foreignKey: 'userId' });

    // User vs Comment -- one to many
    User.hasMany( models.Comment, { foreignKey: 'userId'});

    // User vs PostLike -- one to many
    User.hasMany( models.PostLike, { foreignKey: 'userId'});

    // User vs UserFollows -- many to many (self joining)
    const columnMappingOne = { // User vs User, through Follow as follower
      through: 'Follow',
      otherKey: 'followingId',
      foreignKey: 'followerId',
      as: 'followings'
    }

    const columnMappingTwo = {
      through: 'Follow',
      otherKey: 'followerId',
      foreignKey: 'following',
      as: 'followers'
    }

    User.belongsToMany(models.User, columnMappingOne);
    User.belongsToMany(models.User, columnMappingTwo);

  };
  return User;
};
