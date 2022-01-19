const express = require('express');
const { check, validationResult } = require('express-validator')
const router = express.Router();

const db = require('../db/models');

const cookieParser = require('cookie-parser')
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

// need to confirm the directory
// const { asyncHandler } = require('./')

const asyncHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next);

// need to add asyncHandler
router.get('/posts/create', csrfProtection, async(req, res) => {
  const post = db.Post.build();
  res.render('create-post', {
    title: 'Add New Story',
    post,
    csrfToken: req.csrfToken()
  })
})

const postValidators = [
  check('title')
    .exists({ checkFalsy: true})
    .withMessage('Title cannot be empty.')
    .isLength({ max: 255 })
    .withMessage('Title must be less than 255 characters.'),
  check('content')
    .exists({ checkFalsy: true})
    .withMessage('Content cannot be empty.')

]


router.post('/posts/create', postValidators, csrfProtection, asyncHandler(async(req, res) => {
  const {
    title,
    content
  } = req.body

  console.log('req.body is HERE!!')
  const post = db.Post.build({
    // userId: res.locals.user.id,
    title,
    content
  })
  const validationErrors = validationResult(req);

  if (validationErrors.isEmpty()) {
    await post.save();
    res.redirect('/'); // maybe redirect to user profile page
  } else {
    const errors = validationErrors.array().map((error) => error.msg);
    res.render('create-post', {
      title: 'Add New Story',
      post,
      errors,
      csrfToken: req.csrfToken()
    })
  }
}))


module.exports = router
