const express = require('express');
const router = express.Router();

const { loginUser, logoutUser } = require('../middleware/auth.js');
const { validationResult } = require("express-validator");

const { asyncHandler } = require('../middleware/error-handling');
const { signUpValidators, loginValidators } = require('../middleware/formValidators')
const csrf = require('csurf');
const csrfProtection = csrf({cookie: true});
const bcrypt = require('bcryptjs');

const db = require('../db/models');
router.use(express.static('./images'));


// router.route('/')
// .post(asyncHandler(async(req, res) => {

//   console.log('hello world');
//   console.log('debugger');

//   const posts = await db.PostLike.findAll();

//   res.json({posts});

// }));


router.route('/')
.get(asyncHandler(async(req, res) => { 
  const userId = parseInt(req.params.id, 10);
  const queryData = await db.User.findByPk(userId, {
    include: {
      model: db.Post,
      as: 'posts',
      order: [['createdAt', 'DESC']],
      include: [{
        model: db.PostLike,
        as: 'postLikes'
      }, {
        model: db.Comment,
        as: 'comments',
      },
    ]
    }
  });

  // console.log(`debugger`);
  // console.log(queryData);

  const posts = [];

  for(const post of queryData.posts){
      const month = [
        'Jan', 'Feb', 'Mar', 'Apr',
        'May', 'Jun', 'Jul', 'Aug',
        'Sep', 'Oct', 'Nov', 'Dec'
      ][post.createdAt.getMonth()];
      const day = post.createdAt.getDay() + 1;
      const year = post.createdAt.getFullYear();

      posts.push({
          date: `${month} ${day}, ${year}`,
          postId: post.id,
          title: post.title,
          content: post.content,
          likesCount: post.postLikes.length,
          commentsCount: post.comments.length,
        });
    };

    // console.log('debugger')
    // console.log('posts')
    // console.log(posts)

    res.json({posts})

}));


module.exports = router;
