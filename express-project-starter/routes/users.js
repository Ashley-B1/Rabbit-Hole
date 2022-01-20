const express = require('express');
const { asyncHandler } = require('../middleware/error-handling');
const { signUpValidators } = require('../middleware/validators/ourProjectValidators')
const csrf = require('csurf');
const csrfProtection = csrf({cookie: true});
const router = express.Router();
const bcrypt = require('bcryptjs');
const { loginUser } = require('../../auth');

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.get('/user/create', csrfProtection, asyncHandler(async(req, res) => {
  const user = db.User.build();
  res.render('create-user', {
    title: 'New User',
    user,
    csrfToken: req.csrfToken(),
  });
}));

router.post('user/create', csrfProtection, signUpValidators, asyncHandler(async(req, res) => {
  const { userName, firstName, lastName, email, password } = req.body;
  const user = db.User.build({ userName, firstName, lastName, email });
  const validatorErrors = validationResult(req);

  if(validatorErrors.isEmpty()){
    const hashedPassword = await bcrypt.hash(password, 10);
    user.hashedPassword = hashedPassword;
    await user.save();
    loginUser(req, res, user);
    res.redirect('/');
  } else {
    const errors = validatorErrors.array().map(error => error.msg);
    res.render('create-user', { title: 'New User', user, errors, csrfToken: req.csrfToken() });
  }
}));

module.exports = router;
