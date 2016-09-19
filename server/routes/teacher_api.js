var express = require('express');
var router = express.Router();
var passport = require('passport');

var Teacher = require('../models/teacher.js');


router.post('/register', function(req, res) {
  Teacher.register(new Teacher({ username: req.body.username , name: req.body.name, phone_number: req.body.phone_number}),
    req.body.password, function(err, account) {
    if (err) {
      console.log('err: ' + err);
      return res.status(500).json({
        err: err
      });
    }
    passport.authenticate('teacher')(req, res, function () {
      return res.status(200).json({
        status: 'Registration successful!'
      });
    });
  });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('teacher', function(err, doc, info) {
    if (err) {
      return next(err);
    }
    if (!doc) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(doc, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in teacher'
        });
      }
      console.log(doc);
      return res.json(doc);
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

router.get('/status', function(req, res) {
  console.log('getting status for: ' + req);
  if (!req.isAuthenticated()) {
    console.log('req not authenticated');
    return res.status(200).json({
      status: false
    });
  }
  console.log('authenticated');
  res.status(200).json({
    status: true
  });
});


module.exports = router;