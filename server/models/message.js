// message model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var Message = new Schema({
  _id: { type: String, unique: true },
  sender_id: String,
  sender_name: String,
  time: String,
  content: String
});

Message.plugin(passportLocalMongoose);
Message.set('autoIndex', false);

module.exports = mongoose.model('messages', Message);