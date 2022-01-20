const express = require('express');
const { check, validationResult } = require('express-validator')
const router = express.Router();

const db = require('../db/models');

const cookieParser = require('cookie-parser')
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

const { asyncHandler } = require('../middleware/error-handling')

// Checked, works
router.get(`/posts/:postId(\\d+)/comments/create`, csrfProtection, asyncHandler(async (req, res) => {
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

// router.post(`/posts/:postId(\\d+)/comments/create`, csrfProtection, commentValidators, asyncHandler( async (req, res) => {
//   const { content } = req.body;

//   const postId = parserInt(req.params.postId, 10);

//   const comment = db.Comment.build({
//     // userId: res.locals.user.id,
//     postId,
//     content
//   })

//   const validationErrors = validationResult(req);

//   if (validationErrors.isEmpty()) {
//     await comment.save();
//     res.redirect(`/posts/${postId}`)
//   } else {
//     const errors = validationErrors.array().map((error) => error.msg);
//     res.render('create-comment', {
//       title: 'Add a comment',
//       comment,
//       errors,
//       csrfToken: req.csrfToken()
//     })
//   }

// }))

// Add a edit route

// Haven't checked yet.
router.post('posts/:postId/comments/:commentId', csrfProtection, asyncHandler(async(req, res) => {
  const commentId = parseInt(req.params.commentId, 10);
  const comment = await db.Comment.findByPk(commentId);
  await comment.destroy();
  res.redirect(`/`);
}));


module.exports = router