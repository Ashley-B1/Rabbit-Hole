//todo: Express-validator validations as middleware for the API routes
const { check, validationResult } = require('express-validator');

//todo: spread out the different validatorsArrays into different files/modules once you write them all out. Thanks!
//* what other kinds of validators do we want to include??


const { validationResult } = require("express-validator");

const asyncHandler = (handler) => (req, res, next) =>
  handler(req, res, next).catch(next);

const handleValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array().map((error) => error.msg);

    const err = Error("Bad request.");
    err.status = 400;
    err.title = "Bad request.";
    err.errors = errors;
    return next(err);
  }
  next();
};


const validateEmailAndPassword = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a password."),
  handleValidationErrors,
];


const postNotFoundError = (id) => {
  const err = Error("Tweet not found");
  err.errors = [`Tweet with id of ${id} could not be found.`];
  err.title = "Tweet not found.";
  err.status = 404;
  return err;
};
const commentNotFoundError = (id) => {
  const err = Error("Tweet not found");
  err.errors = [`Tweet with id of ${id} could not be found.`];
  err.title = "Tweet not found.";
  err.status = 404;
  return err;
};


const validatePost = [
  check("message")
    .exists({ checkFalsy: true })
    .withMessage("Tweet can't be empty."),
  //  message cannot be longer than 280 characters:
  check("message")
    .isLength({ max: 280 })
    .withMessage("Tweet can't be longer than 280 characters."),
  handleValidationErrors,
];



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


  module.exports = {signUpValidators, loginValidators}
