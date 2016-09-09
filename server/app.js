// dependencies
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var mongoose = require('mongoose');
var hash = require('bcrypt-nodejs');
var path = require('path');
var passport = require('passport');
var localStrategy = require('passport-local' ).Strategy;

// mongoose
mongoose.connect('mongodb://localhost/mean-auth');

// schema/models
var Learner = require('./models/learner.js');
var Teacher = require('./models/teacher.js');
var Topic = require('./models/topic.js');
var Request = require('./models/request.js');
var Message = require('./models/message.js');

// create instance of express
var app = express();

// require routes
var learner_routes = require('./routes/learner_api.js');
var teacher_routes = require('./routes/teacher_api.js');
var topic_routes = require('./routes/topic_api.js');
var request_routes = require('./routes/request_api.js');
var message_routes = require('./routes/message_api.js');

// define middleware
app.use(express.static(path.join(__dirname, '../client')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

// configure passport
passport.use('learner', new localStrategy(Learner.authenticate()));
passport.serializeUser(Learner.serializeUser());
passport.deserializeUser(Learner.deserializeUser());

passport.use('teacher', new localStrategy(Teacher.authenticate()));
passport.serializeUser(Teacher.serializeUser());
passport.deserializeUser(Teacher.deserializeUser());





// routes
app.use('/learner/', learner_routes);
app.use('/teacher/', teacher_routes);
app.use('/teacher/topic/', topic_routes);
app.use('/request/', request_routes);
app.use('/request/message/', message_routes);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

// error hndlers
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.end(JSON.stringify({
    message: err.message,
    error: {}
  }));
});

module.exports = app;
