var express = require('express');
var router = express.Router();
var passport = require('passport');

var Learner = require('../models/learner.js');


router.post('/register', function(req, res) {
  Learner.register(new Learner({ username: req.body.username , name: req.body.name, phone_number: req.body.phone_number}),
    req.body.password, function(err, account) {
    if (err) {
      console.log('err: ' + err);
      return res.status(500).json({
        err: err
      });
    }
    console.log('trying to authenticate');
    passport.authenticate('learner')(req, res, function () {
      console.log('authenticating');
      return res.status(200).json({
        status: 'Registration successful!'
      });
    console.log('couldnt authenticate: ' + res);
    });
  });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('learner', function(err, doc, info) {
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
          err: 'Could not log in learner'
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
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: true
  });
});


module.exports = router;