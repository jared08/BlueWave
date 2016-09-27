// learner model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var Request = require('./request.js').schema;


var Learner = new Schema({
  username: String,
  password: String,
  name: String,
  phone_number: String,
  // requests: [String] //request_ids
});

Learner.plugin(passportLocalMongoose);


module.exports = mongoose.model('learners', Learner);