// const {environment} = require('../config');
const dbErrors = require('./dbErrors');


const asyncHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next);

const errorCatcher = (req, res, next) => {
  const err = new Error('The page couldn\'t be found.');
  err.status = 404;
  next(err);
};

const errorLogger = (err, req, res, next) => {
  if (environment === 'production' || 
      environment === 'test') {
    dbErrors.push(err); //* this will add errors to the 'dbErrors' array so we can visualize them.
  } else {
    console.error(err);
  }
  next(err);
};

const pageNotFoundErrorHandler = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404);
    res.render('page-not-found', {title: 'Page Not Found'});
  } else {
    next(err);
  }
};

const genericServerErrorHandler = (err, req, res, next) => {
  res.status(err.status || 500);
  const isProduction = environment === 'production';
  res.render('error', {
    title: 'Server Error',
    message: isProduction ? null : err.message,
    stack: isProduction ? null : err.stack,
  });
};



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

module.exports = {asyncHandler, errorCatcher, errorLogger, pageNotFoundErrorHandler, genericServerErrorHandler};