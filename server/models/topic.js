// topic model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var Topic = new Schema({
  _id: false,
  name: String,
  experience: Number,
  rating: Number,
  num_classes: Number
});

Topic.plugin(passportLocalMongoose);
// Topic.set('autoIndex', false);

module.exports = mongoose.model('topic', Topic);