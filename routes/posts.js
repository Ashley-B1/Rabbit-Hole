const express = require('express');
const { check, validationResult } = require('express-validator')
const router = express.Router();

const db = require('../db/models');

const cookieParser = require('cookie-parser')
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });


const { asyncHandler, handleValidationErrors, commentNotFoundError } = require('../middleware/error-handling')
const { postValidators } = require('../middleware/formValidators')

router.use(express.static('./images'));


const commentValidators = [
  check('content')
    .exists({ checkFalsy: true})
    .withMessage('Please provide content for your comment.'),
  handleValidationErrors,
]


// Get Post
router.route(`/:id`)
.get(asyncHandler(async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = await db.Post.findByPk(postId, { include: ['users'] });

  res.render('post-detail', { post, postId })
}));

// Create Post
router.get('/create', csrfProtection, async(req, res) => {
  const post = db.Post.build();
  res.render('create-post', {
    title: 'Add New Story',
    post,
    csrfToken: req.csrfToken()
  })
})

// Create Post
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


// Edit Post
router.get('/:id/edit', csrfProtection, asyncHandler(async(req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = await db.Post.findByPk(postId);
  console.log("post.content is HERE!!", post.content)

  res.render("edit-post", {
    title: 'Edit Story',
    post,
    csrfToken: req.csrfToken()
  })
}))

// Edit Post
router.post('/:id/edit', postValidators, csrfProtection, asyncHandler(async(req, res) => {
  const postId = parseInt(req.params.id, 10);
  const postToUpdate = await db.Post.findByPk(postId);
  const postOwnerId = postToUpdate.userId;

  const { title, content } = req.body;

  const post = { userId: postOwnerId, title, content };

  const validatorErrors = validationResult(req);

  if (validatorErrors.isEmpty()){
    await postToUpdate.update(post);
    res.redirect(`/posts/${postId}`)
  } else {
    const errors = validatorErrors.array().map((error) => error.msg);
    res.render('edit-post', {
      post: { ...post, id: postId},
      errors,
      csrfToken: req.csrfToken()
    })
  }
}))

// Delete Post
router.get('/:id/delete', csrfProtection, asyncHandler(async(req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = await db.Post.findByPk(postId);
  res.render('delete-post', {
    title: 'Delete Story',
    post,
    csrfToken: req.csrfToken()
  })
}))

// Delete Post
router.post('/:id/delete', csrfProtection, asyncHandler(async(req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = await db.Post.findByPk(postId, { include: 'comments'});
  const comments = await db.Comment.findAll({where: { postId: postId }})

  for (let i = 0; i < comments.length; i++){
    await comments[i].destroy();
  }

  await post.destroy();
  res.redirect(`/`);
}));




//************************************************************************************* */
// API 
//************************************************************************************* */

// Get Comments
router.route(`/:id/comments`)
.get(asyncHandler(async(req, res) => {
  const postId = parseInt(req.params.id, 10);
  
  const comments = await db.Comment.findAll({
    where: {postId},
    include: ['users'],
    order: [["createdAt", "DESC"]]
  });
  res.json({comments, postId})
}))
.post(
  commentValidators,
  asyncHandler(async(req, res) => {
    const userId = req.session.auth.userId;
    const postId = parseInt(req.params.id, 10);

    const {content} = req.body;
    const comment = await db.Comment.create({ userId, postId, content});

    res.json({ comment });
}))

// Delete Comment
router.route(`/:id/comments/:commentId`)
.delete(
  asyncHandler(async (req, res, next) => {
    const commentId = parseInt(req.params.commentId, 10);
    const comment = await db.Comment.findByPk(commentId);

    // console.log('debugger');
    // console.log(`req user: ${req.session.auth.userId}`);
    if (req.session.auth.userId !== comment.userId) {
      const err = new Error("Unauthorized");
      err.status = 401;
      err.message = "You are not authorized to delete this comment.";
      err.title = "Unauthorized";
      throw err;
    }
    if (comment) {
      await comment.destroy();
      res.json({ message: `Deleted comment with id of ${commentId}.` });
    } else {
      next(commentNotFoundError(commentId));
    }
  }));

// Edit Comment
router.get('/:id/comments/:commentId/edit', csrfProtection, asyncHandler(async(req, res) => {
  const postId = parseInt(req.params.id, 10);
  const commentId = parseInt(req.params.commentId, 10);
  console.log("hohoho", commentId)
  const comment = await db.Comment.findByPk(commentId);
  res.render('edit-comment', {
    postId,
    comment,
    csrfToken: req.csrfToken()
  })
}))


// Edit Comment
router.post('/:id/comments/:commentId/edit', commentValidators, csrfProtection, asyncHandler(async(req, res) => {
  const postId = parseInt(req.params.id, 10);
  const commentId = parseInt(req.params.commentId, 10);
  const commentToUpdate = await db.Comment.findByPk(commentId);
  const { content } = req.body;

  const comment = { userId: commentToUpdate.userId, postId: postId, content };

  const validatorErrors = validationResult(req);

  if (validatorErrors.isEmpty()){
    await commentToUpdate.update(comment);
    res.redirect(`/posts/${postId}`)
  } else {
    const errors = validatorErrors.array().map((error) => error.msg);
    res.render('edit-comment', {
      title: 'Edit Comment',
      comment: { ...comment, id: commentId },
      commentId,
      errors,
      csrfToken: req.csrfToken()
    })
  }
}))


module.exports = router
