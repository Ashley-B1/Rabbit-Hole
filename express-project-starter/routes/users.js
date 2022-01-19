const bcrypt = require('bcryptjs/dist/bcrypt');
const express = require('express');
const { loginUser } = require('../auth');
const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});


router.get('/user/login', csrfProtection, (req, res) => {
  res.render('user-login', { title: 'Login', csrfToken: req.csrfToken() });
});

const loginValidators = [
  check('email')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a valid email.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please enter a valid password.')
]

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


module.exports = router;
