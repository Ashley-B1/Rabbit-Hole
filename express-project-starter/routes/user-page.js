const express = require('express');
const router = express.Router();
const path = require('path');
const {asyncHandler} = require('../middleware/error-handling');

const db = require('../db/models');

router.use(express.static('./images'));
router.use(express.static(path.join(__dirname, 'public')));

router.route('/')
.get(asyncHandler(async(req, res) => {
  // const users = await db.User.findAll({order: [['userName', 'DESC']]}); //? do we want to condense how much data we want to send in our response on this side?
  // res.render('list-users', users);
  res.render('list-users');
}));

router.route('/:id(\\d+)')
.get(asyncHandler(async(req, res) => {
  const userId = parseInt(req.params.id, 10);
  const {userName} = await db.User.findByPk(userId);

  const likesCount = await db.PostLike.findAll({
    where: userId && (postId='something'),
    //! implement correct logic for likes
  });
  // console.log(`likes count: ${likesCount}`)

  const comments = await db.Comment.findAll({where: userId});
  // console.log(`comments: ${comments}`)
  //todo: comments will be more necessary for a 'post' page where comments will be rendered explicitly (namely, the content)
  const commentsCount = comments.length || 0;
  // console.log(`commentsCount: ${commentsCount}`)

  const followers = (await db.Follow.findAll({where: userId})).length || 0;
  const followersCount = `${followers} ${(followers > 1 || followers <= 0) ? 'Followers' : 'Follower'}`;

  const posts = await db.Post.findAll({
    where: userId,
    order: [["createdAt", "DESC"]],
  });

  let date;

  for(const post of posts){
    const month = [
      'Jan', 'Feb', 'Mar', 'Apr',
      'May', 'Jun', 'Jul', 'Aug',
      'Sep', 'Oct', 'Nov', 'Dec'
    ][post.createdAt.getMonth()];
    
    const day = post.createdAt.getDay() + 1;
    const year = post.createdAt.getFullYear();
    
    date = `${month} ${day}, ${year}`;
  }


  res.render('user-page', {
    userName,
    posts,
    followersCount,
    likesCount,
    commentsCount,
    date,
  })
}));



//todo: 
// router.route('/follows')
// .get((req, res) => {

//   res.render('user-follows-page', {

//   });
// });


module.exports = router;