const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('home-page', { title: 'rabbit hole' });
});

module.exports = router;
