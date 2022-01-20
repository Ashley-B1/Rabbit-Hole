//todo: Express-validator validations as middleware for the API routes
const { check } = require('express-validator');

//todo: spread out the different validatorsArrays into different files/modules once you write them all out. Thanks!
//* what other kinds of validators do we want to include??

const 


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

const loginValidators = [];

//todo ***********************************************************************************
//todo this is a snippet to show WHERE in the code we would add 
//todo 'routes/users.js'

const { check, validationResult } = require('express-validator');
router.route('/users/add')
.get(csrfProtection, (req, res) => {
  const book = db.Book.build();
  res.render('book-add', {
    title: 'Add Book',
    book,
    csrfToken: req.csrfToken(),
  });
})
.post(csrfProtection, bookValidators, //! add bookValidators here
  asyncHandler(async (req, res) => {
    const {
      title,
      author,
      releaseDate,
      pageCount,
      publisher,
    } = req.body;
    
    const book = db.Book.build({
      title,
      author,
      releaseDate,
      pageCount,
      publisher,
    });
    
    const validatorErrors = validationResult(req);
    
    if (validatorErrors.isEmpty()) {
      await book.save();
      res.redirect('/');
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.render('book-add', {
        title: 'Add Book',
        book,
        errors,
        csrfToken: req.csrfToken(),
      });
    }
  }));
  //todo ***********************************************************************************
  
  
  module.exports = {signUpValidators}