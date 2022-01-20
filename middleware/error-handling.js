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

module.exports = {asyncHandler, errorCatcher, errorLogger, pageNotFoundErrorHandler, genericServerErrorHandler};