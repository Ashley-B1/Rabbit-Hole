

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