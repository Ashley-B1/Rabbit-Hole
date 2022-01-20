const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { sequelize } = require('./db/models');
const session = require('express-session');
const { sessionSecret } = require('./config');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const { restoreUser } = require('./middleware/auth.js')
const {errorCatcher, errorHandler} = require('./middleware/error-handling');

const indexRouter = require('./routes/index');
const postRouter = require('./routes/posts');
const usersRouter = require('./routes/users');


const app = express();

// view engine setup
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(sessionSecret));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('./images'));

// set up session middleware
const store = new SequelizeStore({ db: sequelize });

app.use(
  session({
    secret: sessionSecret,
    store,
    saveUninitialized: false,
    resave: false,
  })
);

// create Session table if it doesn't already exist
store.sync();
app.use(restoreUser);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postRouter);




// catch 404 and forward to error handler



app.use([errorCatcher, errorHandler])

module.exports = app;
