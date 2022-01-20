const express = require('express');
const router = express.Router();

const { loginUser, logoutUser } = require('../middleware/auth.js');
const { validationResult } = require("express-validator");

const { asyncHandler } = require('../middleware/error-handling');
const { signUpValidators, loginValidators } = require('../middleware/formValidators')
const csrf = require('csurf');
const csrfProtection = csrf({cookie: true});
const bcrypt = require('bcryptjs');

// const path = require('path');
// router.use(express.static(path.join(__dirname, 'public')));

const db = require('../db/models');
router.use(express.static('./images'));


router.route('/')
.get(asyncHandler(async(req, res) => {
  const users = await db.User.findAll({order: [['createdAt', 'ASC']]}); //? do we want to condense how much data we want to send in our response on this side?
  res.render('list-users', {users});
}));



router.route('/login')
.get(csrfProtection, (req, res) => {
  res.render('user-login', { title: 'Login', csrfToken: req.csrfToken() });
})
.post(csrfProtection, loginValidators, asyncHandler(async(req, res) => {
  const { email, password } = req.body;

  let errors = [];
  const validatorErrors = validationResult(req);

  if(validatorErrors.isEmpty()){
    const user = await db.User.findOne({ where: { email }});
    if(user !== null) {
      const passWordMatch = await bcrypt.compare(password, user.hashedPassword.toString());
      if(passWordMatch) {
        loginUser(req, res, user);
        return res.redirect('/');
      }
    }
    errors.push('Login failed. Invalid email or password provided.')
  } else {
    errors = validatorErrors.array().map(error => error.msg);
  }

  res.redirect('/')

  res.render('user-login', {
    title: 'Log In',
    email,
    errors,
    csrfToken: req.csrfToken()
  });
}));

router.post('/logout', (req, res) => {
  logoutUser(req, res);
  res.redirect('/login');
})


router.route('/create')
.get(csrfProtection, asyncHandler(async(req, res) => {
  const user = db.User.build();
  res.render('create-user', {
    title: 'New User',
    user,
    csrfToken: req.csrfToken(),
  });
}))
.post(csrfProtection, signUpValidators, asyncHandler(async(req, res) => {
  const { userName, firstName, lastName, email, password } = req.body;
  const user = db.User.build({ userName, firstName, lastName, email });
  const validatorErrors = validationResult(req);

  if(validatorErrors.isEmpty()){
    const hashedPassword = await bcrypt.hash(password, 10);
    user.hashedPassword = hashedPassword;
    await user.save();
    loginUser(req, res, user);
    res.redirect('/');
  } else {
    const errors = validatorErrors.array().map(error => error.msg);
    res.render('create-user', { title: 'New User', user, errors, csrfToken: req.csrfToken() });
  }
}));


router.route('/:id(\\d+)')
.get(asyncHandler(async(req, res) => {
  const userId = parseInt(req.params.id, 10);
  const {userName} = await db.User.findByPk(userId);

  const likesCount = await db.PostLike.findAll({
    where: userId,
    // where: userId && (postId='something'),
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
