var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var shippingAddressRouter = require('./routes/shippingAddress');
var product = require('./routes/product');
var classify = require('./routes/classify');

var app = express();

var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var dbUrl = 'mongodb://localhost/mall';
mongoose.connect(dbUrl);
mongoose.connection.on('connected',()=>{
    console.log("MongoDB connected success.");
});

app.use(session({
  secret: 'mall',
  name: 'login-user', //这里的name值得是cookie的name，默认cookie的name是：connect.sid
  cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 5
  }, //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
  store: new MongoStore({
      url: dbUrl,
      collection: 'sessions'
  }),
  resave: false,
  saveUninitialized: true
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/shippingAddress', shippingAddressRouter);
app.use('/api/product', product);
app.use('/api/classify', classify);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
