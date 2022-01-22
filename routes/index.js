const express = require('express');
const { asyncHandler } = require('../middleware/error-handling');
const router = express.Router();
const db = require('../db/models');

router.route('/')
.get(asyncHandler(async(req, res) => {
  const posts = await db.Post.findAll({ limit: 6 })

  // console.log(posts);
  res.render('home-page', { title: 'Rabbit Hole', posts })
}));

module.exports = router;
