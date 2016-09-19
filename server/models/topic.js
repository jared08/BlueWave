// topic model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var Topic = new Schema({
  _id: false,
  name: String,
  experience: Number,
  rating: Number
});

Topic.plugin(passportLocalMongoose);


module.exports = mongoose.model('topic', Topic);