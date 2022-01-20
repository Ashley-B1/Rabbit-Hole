// const {environment} = require('../config');
const dbErrors = require('./dbErrors');


const asyncHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next);

const errorCatcher = (req, res, next) => next(createError(404));

const errorHandler =(err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
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

module.exports = {asyncHandler, errorCatcher, errorHandler};