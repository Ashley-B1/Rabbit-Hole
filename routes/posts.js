const express = require('express');
const { check, validationResult } = require('express-validator')
const router = express.Router();

const db = require('../db/models');

const cookieParser = require('cookie-parser')
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });


const { asyncHandler } = require('../middleware/error-handling')
const { postValidators } = require('../middleware/formValidators')

// Checked, works
router.get('/posts/create', csrfProtection, async(req, res) => {
  const post = db.Post.build();
  res.render('create-post', {
    title: 'Add New Story',
    post,
    csrfToken: req.csrfToken()
  })
})

// Not works, only display 404 not found, no other error message
router.post('/posts/create', postValidators, csrfProtection, asyncHandler(async(req, res) => {
  const {
    title,
    content
  } = req.body

  const post = db.Post.build({
    userId: 6,
    title,
    content
  })

  console.log("WWWWWW", title, content)

  // const validationErrors = validationResult(req);

  // if (validationErrors.isEmpty()) {
  //   await post.save();
  //   res.redirect('/'); // maybe redirect to user profile page
  // } else {
  //   const errors = validationErrors.array().map((error) => error.msg);
  //   res.render('create-post', {
  //     title: 'Add New Story',
  //     post,
  //     errors,
  //     csrfToken: req.csrfToken()
  //   })
  // }
}))


// Checked, can display post title and content, but haven't checked if the comments can be displayed
router.get(`/posts/:id`, asyncHandler(async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = await db.Post.findByPk(postId, { include: ['users'] });

  const comments = await db.Comment.findAll({
    where: {
      postId: postId
    }
  })
  res.render('post-detail', { post })

}));

// delete routes, haven't tested yet
router.post('posts/:id/delete', csrfProtection, asyncHandler(async(req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = await db.Post.findByPk(postId);
  await post.destroy();
  res.redirect(`/`);
}));



module.exports = router
