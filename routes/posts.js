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

// router.use((req, res, next) => {
//   console.log(req.path);
//   next();
// })

router.get('/:id/edit', csrfProtection, asyncHandler(async(req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = await db.Post.findByPk(postId);
  // const postOwnerId = postToUpdate.userId;
  // const userId = req.session.auth.userId;
  console.log("post.content is HERE!!", post.content)

  res.render("edit-post", {
    title: 'Edit Story',
    post,
    csrfToken: req.csrfToken()
  })
}))

// Edit story
router.post('/:id/edit', postValidators, csrfProtection, asyncHandler(async(req, res) => {
  const postId = parseInt(req.params.id, 10);
  const postToUpdate = await db.Post.findByPk(postId);
  const postOwnerId = postToUpdate.userId;
  // const userId = req.session.auth.userId;

  // if (postOwnerId===userId) {

  // }

  const {
    title,
    content
  } = req.body


  const post = {
    userId: postOwnerId,
    title,
    content
  }

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

router.get('/:id/delete', csrfProtection, asyncHandler(async(req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = await db.Post.findByPk(postId);
  res.render('delete-post', {
    title: 'Delete Story',
    post,
    csrfToken: req.csrfToken()
  })
}))

// delete routes, haven't tested yet
router.post('/:id/delete', csrfProtection, asyncHandler(async(req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = await db.Post.findByPk(postId, { include: 'comments'});
  const comments = await db.Comment.findAll({
    where: {
      postId: postId
    }
  })
  // const comments = await db.Comment.findByPk(postId);
  console.log("--------------------")
  console.log("comments of the post!!!!", comments)
  console.log("--------------------")

  

  for (let i = 0; i < comments.length; i++) {
    await comments[i].destroy();
  }

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

// Get the edit form
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

// Update the edit form
router.post('/:id/comments/:commentId/edit', commentValidators, csrfProtection, asyncHandler(async(req, res) => {
  const postId = parseInt(req.params.id, 10);
  const commentId = parseInt(req.params.commentId, 10);
  console.log("1 --------------------------");
  console.log("req", req);
  console.log("2 --------------------------");
  console.log("req.params",req.params);
  console.log("3 --------------------------");
  console.log("commentId",commentId)
  console.log("--------------------------");
  const commentToUpdate = await db.Comment.findByPk(commentId);
  const { content } = req.body;

  const comment = {
    userId: commentToUpdate.userId,
    postId: postId,
    content
  }

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

// get the delete form
router.get('/:id/comments/:commentId/delete', csrfProtection, asyncHandler(async(req, res) => {
  const commentId = parseInt(req.params.commentId, 10);
  const comment = await db.Comment.findByPk(commentId);
  const postId = parseInt(req.params.id, 10)
  res.render('delete-comment', {
    title: 'Delete Comment',
    postId,
    comment,
    csrfToken: req.csrfToken()
  })
}))

// delete the comment
router.post('/:id/comments/:commentId/delete', csrfProtection, asyncHandler(async(req, res) => {
  const commentId = parseInt(req.params.commentId, 10);
  const comment = await db.Comment.findByPk(commentId);
  const postId = parseInt(req.params.id, 10);
  console.log("comment!!!!!!", comment);
  console.log("postID!!!!", postId)
  await comment.destroy();
  res.redirect(`/posts/${postId}`);
}));



module.exports = router
