'use strict';
module.exports = (sequelize, DataTypes) => {
  const PostLike = sequelize.define('PostLike', {
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER
  }, {});
  PostLike.associate = function(models) {
    // associations can be defined here
    PostLike.belongsTo( models.User, { foreignKey: 'userId'})
  };
  return PostLike;
};
