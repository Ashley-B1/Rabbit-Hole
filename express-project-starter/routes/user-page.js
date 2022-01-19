const express = require('express');
const router = express.Router();
const {asyncHandler} = require('../middleware/error-handling');

const db = require('../db/models');

router.route('/')
.get(asyncHandler(async(req, res) => {
  // const users = await db.User.findAll({order: [['userName', 'DESC']]}); //? do we want to condense how much data we want to send in our response on this side?
  // res.render('list-users', users);
  res.render('list-users');
}));

router.route('/:id(\\d+)')
.get(asyncHandler(async(req, res) => {
  const userId = parseInt(req.params.id, 10);

  // const likesCount = await db.PostLike.findAll({where: postId}).length;
  
  // const comments = await db.Comment.findAll({where: postId});
  // const commentsCount = comments.length;

  // const posts = await db.Post.findAll({
  //   order: [["createdAt", "DESC"]],
  //   // include: [{ model: User, as: "user", attributes: ["username"] }],
  // });


  res.render('user-page', {
    // posts
    userName: userId,
    followersCount: 1,
  })
}));



//todo: 
// router.route('/follows')
// .get((req, res) => {

//   res.render('user-follows-page', {

//   });
// });


module.exports = router;