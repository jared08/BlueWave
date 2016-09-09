// message model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var Message = new Schema({
  sender_id: String,
  sender_name: String,
  time: String,
  content: String
});

Message.plugin(passportLocalMongoose);


module.exports = mongoose.model('messages', Message);