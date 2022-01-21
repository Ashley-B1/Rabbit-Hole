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

// works
router.post('/create', postValidators, csrfProtection, asyncHandler(async(req, res) => {
  const { title, content } = req.body;

  const userId = req.session.auth.userId;
  const post = db.Post.build({
    userId: userId,
    title,
    content
  })


  const validationErrors = validationResult(req);

  if (validationErrors.isEmpty()) {
      await post.save();
      res.redirect(`/users/${userId}`);

  } else {
      const errors = validationErrors.array().map((error) => error.msg);
      res.render('create-post', {
            title: 'Add New Story',
            post,
            errors,
            csrfToken: req.csrfToken()
        })
      }
    res.redirect(`/posts/create`)
}))


// Checked, can display post title and content, but haven't checked if the comments can be displayed
router.get(`/:id`, asyncHandler(async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = await db.Post.findByPk(postId, { include: ['users'] });

  const comments = await db.Comment.findAll({
    where: {
      postId: postId
    },
    include: ['users'],
    order: [["createdAt", "DESC"]]
  });

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


// Checked, works
router.get(`/:id/comments/create`, csrfProtection, asyncHandler(async (req, res) => {
  const comment = db.Comment.build();
  const postId = req.params.id
  res.render('create-comment', {
    title: 'Add a comment',
    postId,
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

  const postId = parseInt(req.params.id, 10);

  const userId = req.session.auth.userId;

  const comment = db.Comment.build({
    userId: userId,
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
