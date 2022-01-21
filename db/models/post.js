'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.TEXT
  }, {});
  Post.associate = function(models) {
    // associations can be defined here
    Post.belongsTo( models.User, {
      as: 'users',
      foreignKey: 'userId'
    });
    Post.hasMany( models.PostLike, {
      as: 'postLikes',
      foreignKey: 'postId'
    });
  };
  return Post;
};
