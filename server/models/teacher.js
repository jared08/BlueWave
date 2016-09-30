// teacher model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var Topic = require('./topic.js').schema;


var Teacher = new Schema({
  username: String,
  password: String,
  name: String,
  phone_number: String,
  topics: [Topic] 
});

Teacher.plugin(passportLocalMongoose);
Teacher.set('autoIndex', false);

module.exports = mongoose.model('teachers', Teacher);