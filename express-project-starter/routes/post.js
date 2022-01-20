const express = require('express');
const router = express.Router();

const db = require('../db/models');

const cookieParser = require('cookie-parser')
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

// need to confirm the directory
// const { asyncHandler } = require('./')

// need to add asyncHandler
router.get('/posts/create', csrfProtection, async(req, res) => {
  const post = db.Post.build();
  res.render('create-post', {
    title: 'Add New Story',
    post,
    csrfToken: req.csrfToken()
  })
})


module.exports = router
