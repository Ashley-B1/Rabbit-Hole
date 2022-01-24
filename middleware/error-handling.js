

const asyncHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next);

const errorCatcher = (req, res, next) => {
  const err = new Error('The page couldn\'t be found.');
  err.status = 404;
  next(err);
};

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

const commentNotFoundError = (id) => {
  const err = Error("Comment not found");
  err.errors = [`Comment with id of ${id} could not be found.`];
  err.title = "Comment not found.";
  err.status = 404;
  return err;
};


module.exports = {asyncHandler, errorCatcher, errorHandler, handleValidationErrors, commentNotFoundError};