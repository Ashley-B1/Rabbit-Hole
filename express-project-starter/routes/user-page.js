const express = require('express');
const router = express.Router();

const db = require('../db');


router.route('/')
.get((req, res) => {
  // const {
    //   id,
    //   userId,
    //   createdAt,
    //   title,
    //   content, 
    //   createdAt
    // } = reference database
    // const postId = parseInt(req.params.postId, 10)
    // const posts = await db.Post.findAll(postId);




    const likes = await db.Likes.findAll({
      where: postId
    });
    const likesCount = likes.length;

    const comments = await db.Comments.findAll({
      where: postId
    });
    const commentsCount = comments.length;

    const posts = await db.Post.findAll({
      include: [{ model: User, as: "user", attributes: ["username"] }],
      order: [["createdAt", "DESC"]],
      attributes: ["message"],
    });
    res.render('/', posts)


  res.render('user-page', {

  })
});



module.exports = router;