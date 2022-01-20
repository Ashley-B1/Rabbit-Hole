const express = require('express');
const router = express.Router();

const { loginUser, logoutUser } = require('../middleware/auth.js');

const { asyncHandler } = require('../middleware/error-handling');
const { signUpValidators, loginValidators } = require('../middleware/formValidators')
const csrf = require('csurf');
const csrfProtection = csrf({cookie: true});

const bcrypt = require('bcryptjs');

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});



router.get('/user/login', csrfProtection, (req, res) => {
  res.render('user-login', { title: 'Login', csrfToken: req.csrfToken() });
});



router.post('/user/login', csrfProtection, loginValidators, asyncHandler(async(req, res) => {
  const { email, password } = req.body;

  let errors = [];
  const validatorErrors = validationResult(req);

  if(validatorErrors.isEmpty()){
    const user = await db.User.findOne({ where: { email }});
    if(user !== null) {
      const passWordMatch = await bcrypt.compare(password, user.hashedPassword.toString());
      if(passWordMatch) {
        loginUser(req, res, user);
        return res.redirect('/');
      }
    }
    errors.push('Login failed. Invalid email or password provided.')
  } else {
    errors = validatorErrors.array().map(error => error.msg);
  }

  res.render('user-login', {
    title: 'Log In',
    email,
    errors,
    csrfToken: req.csrfToken()
  });
}));

router.post('/user/logout', (req, res) => {
  logoutUser(req, res);
  res.redirect('/user/login');
})


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
