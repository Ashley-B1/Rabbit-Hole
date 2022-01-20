const express = require('express');
const { check, validationResult } = require('express-validator')
const router = express.Router();

const db = require('../db/models');

const cookieParser = require('cookie-parser')
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });


const { asyncHandler } = require('../middleware/error-handling')
const { postValidators } = require('../middleware/formValidators')

router.use(express.static('./images'));


// Checked, works
router.get('/create', csrfProtection, async(req, res) => {
  const post = db.Post.build();
  res.render('create-post', {
    title: 'Add New Story',
    post,
    csrfToken: req.csrfToken()
  })
})

// Not works, only display 404 not found, no other error message
router.post('/create', postValidators, csrfProtection, asyncHandler(async(req, res) => {
  const { title, content } = req.body;

  const post = db.Post.build({
    userId: req.session.auth.userId,
    title,
    content
  })

  console.log("WWWWWW")
  res.redirect(`/`)

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
router.get(`/:id`, asyncHandler(async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = await db.Post.findByPk(postId, { include: ['users'] });

  const comments = await db.Comment.findAll({
    where: {
      postId: postId
    }
  })
  res.render('post-detail', { post, comments })

}));

// delete routes, haven't tested yet
router.post('/:id/delete', csrfProtection, asyncHandler(async(req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = await db.Post.findByPk(postId);
  await post.destroy();
  res.redirect(`/`);
}));




// Comments route handlers below


// Need to checked the path
router.get(`/:id/comments/create`, csrfProtection, asyncHandler(async (req, res) => {
  const comment = db.Comment.build();
  res.render('create-comment', {
    title: 'Add a comment',
    comment,
    csrfToken: req.csrfToken()
  })

}));

const commentValidators = [
  check('content')
    .exists({ checkFalsy: true})
    .withMessage('Please provide content for your comment.')
]

// Need to checked the path
router.post(`/:id/comments/create`, csrfProtection, commentValidators, asyncHandler( async (req, res) => {
  const { content } = req.body;

  const postId = parserInt(req.params.id, 10);

  const comment = db.Comment.build({
    // userId: res.locals.user.id,
    postId,
    content
  })

  const validationErrors = validationResult(req);

  if (validationErrors.isEmpty()) {
    await comment.save();
    res.redirect(`/posts/${postId}`)
  } else {
    const errors = validationErrors.array().map((error) => error.msg);
    res.render('create-comment', {
      title: 'Add a comment',
      postId,
      comment,
      errors,
      csrfToken: req.csrfToken()
    })
  }

}))

// Add a edit route

// Haven't checked yet.
router.post('/:id/comments/:commentId/delete', csrfProtection, asyncHandler(async(req, res) => {
  const commentId = parseInt(req.params.commentId, 10);
  const comment = await db.Comment.findByPk(commentId);
  await comment.destroy();
  res.redirect(`/`); // should redirect to the specific post
}));


module.exports = router
