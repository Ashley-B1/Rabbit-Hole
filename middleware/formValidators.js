const { check, validationResult } = require("express-validator");

const signUpValidators = [
  check('username') //* how are these strings identified? are these object keys? class names? Referring to lines 50-56, it seems to be destructured from the request body
  .exists({ checkFalsy: true })
  .withMessage('Please provide a value for Username')
  .isLength({ max: 255 })
  .withMessage('Title must not be more than 255 characters long'),
  check('email')
  .exists({ checkFalsy: true })
  .withMessage('Please provide a valid email address')
  .isLength({ max: 100 }) //* refer to 'express-validator' docs
  .withMessage('Author must not be more than 100 characters long'),
  check('password')
  .exists({ checkFalsy: true })
  .withMessage('Please provide a valid password')
  .isISO8601()
  .withMessage('Please provide a valid date for Release Date'),
  check('confirmedPassword')
  .exists({ checkFalsy: true })
  .withMessage('Please make sure passwords match')
  .isInt({ min: 0 })
  .withMessage('Please provide a valid integer for Page Count'),
];

const loginValidators = [
  check('email')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a valid email.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please enter a valid password.')
];

const postValidators = [
  check('title')
    .exists({ checkFalsy: true})
    .withMessage('Title cannot be empty.')
    .isLength({ max: 255 })
    .withMessage('Title must be less than 255 characters.'),
  check('content')
    .exists({ checkFalsy: true})
    .withMessage('Content cannot be empty.')
]



  module.exports = {signUpValidators, loginValidators, postValidators}
