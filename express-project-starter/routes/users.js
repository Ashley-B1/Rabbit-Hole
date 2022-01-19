var express = require('express');
const { csrfProtection, asyncHandler } = require('./utils');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/user/register', csrfProtection, asyncHandler(async(req, res) => {
  const user = db.User.build();
  res.render('user-register', {
    title: 'New User',
    user,
    csrfToken: req.csrfToken(),
  });
}));

const userValidators = [];

router.post('user/register', csrfProtection, userValidators, asyncHandler(async(req, res) => {
  const { firstName, lastName, emailAddress, password } = req.body;
  const user = db.User.build({ firstName, lastName, emailAddress });
  const validatorErrors = userValidators(req);

  if(!validatorErrors){
    await user.save();
    res.redirect('/');
  } else {
    const errors = validatorErrors.array().map(error => error.msg);
    res.render('user-register', { title: 'New User', user, errors, csrfToken: req.csrfToken() });
  }
}));

module.exports = router;
