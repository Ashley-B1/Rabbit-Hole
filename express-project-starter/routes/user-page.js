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

  const likes = await db.PostLike.findAll({where: userId});
  // console.log(likes)
  const likesCount = (await db.PostLike.findAll({where: userId})).length || 0;
  // console.log(`likes count: ${likesCount}`)

  const comments = await db.Comment.findAll({where: userId});
  // console.log(`comments: ${comments}`)
  const commentsCount = comments.length || 0;
  // console.log(`commentsCount: ${commentsCount}`)

  const followersCount = (await db.Follow.findAll({where: userId})).length || 0;


  const posts = await db.Post.findAll({
    order: [["createdAt", "DESC"]],
  });
  console.log(`posts: ${posts[0].createdAt}`)

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (const post in posts){
    const thing = 2;
    
  };

  res.render('user-page', {
    userName: userId,
    posts,
    followersCount,
    likesCount,
    commentsCount,
    months,
  })
}));



//todo: 
// router.route('/follows')
// .get((req, res) => {

//   res.render('user-follows-page', {

//   });
// });


module.exports = router;