'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    content: DataTypes.TEXT
  }, {});
  Comment.associate = function(models) {
    // associations can be defined here
    Comment.belongsTo( models.User, { foreignKey: 'userId'});
  };
  return Comment;
};
