// request model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var Learner = require('./learner.js');
var Teacher = require('./teacher.js').schema;
var Message = require('./message.js').schema;

var Request = new Schema({
  // _id: { type: String, unique: true },
  learner_id: {type: String, unique: false},
  teacher_id: String,
  state: String,
  question: String,
  topic: String,
  difficulty: String,
  contact_method: String,
  messages: [Message]
});

Request.plugin(passportLocalMongoose);


module.exports = mongoose.model('request', Request);