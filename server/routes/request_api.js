var express = require('express');
var router = express.Router();

var Learner = require('../models/learner.js');
var Request = require('../models/request.js');  
var Teacher = require('../models/teacher.js'); 
var Message = require('../models/message.js'); 
var _ = require('lodash'); 

router.post('/createRequest', function (req, res) {  
  Learner.findOne({_id: req.body.learner_id}, function(learner_err, learner_data) {
    if (learner_err) {
        console.log('learner_err: ' + learner_err);
        return res.status(500).json({
        learner_err: learner_err
      });
    } else {
        console.log('trying to add topic: ' + req.body.topic);
        Request.create(new Request({ learner: learner_data, state: 'pending', question: req.body.question, 
          topic: req.body.topic, difficulty: req.body.difficulty, contact_method: req.body.contact_method }), function(err, doc) {
          if (err) {
                  console.log('ERROR: ' + err);
                  return res.json(err);
                } else {
                  return res.json(doc);
                }
        }); 
    }
  })
});

router.put('/acceptRequest', function (req, res) {
      var teacher_id = req.body.teacher_id;
      Teacher.findOne({_id: teacher_id}, function(teacher_err, teacher_data) {
      if (teacher_err) {
          console.log('teacher_err: ' + teacher_err);
          return res.status(500).json({
          teacher_err: teacher_err
        });
      } else {
        var teacher_name = teacher_data.name;
        var request_id = req.body.request_id; 
        Request.findOne({_id: request_id}, function(request_err, request_data) {  
        if (request_err) {
            console.log('request_err: ' + request_err);
            return res.status(500).json({
            request_err: request_err
          });
        } else {
          console.log('request_data: ' + request_data);
          console.log('request_data.topic: ' + request_data.topic);
          var topic_name = request_data.topic;
          var content = 'Hello, what would you like to learn about ' + topic_name + '?';
          Request.findByIdAndUpdate(request_id, {state: 'in_progress', teacher_id: teacher_id, 
            $push: { 'messages' : (new Message({ sender_id: teacher_id, sender_name: teacher_name, content: content })) }},
                 function (err, doc) {
            if (err) {
                  console.log('ERROR: ' + err);
                  return res.json(err);
                } else {
                  return res.json(doc);
                }
              });
          }
        })
      }
  })
});

router.put('/cancelRequest', function (req, res) {
      Request.findByIdAndUpdate(req.body.request_id, {state: 'pending', teacher_id: null}, function (err, doc) {
        if (err) {
              console.log('ERROR: ' + err);
              return res.json(err);
            } else {
              return res.json(doc);
            }
          });
});

router.put('/finishRequest', function (req, res) {
      Request.findByIdAndUpdate(req.body.request_id, {state: 'finished'}, function (err, doc) {
        if (err) {
              console.log('ERROR: ' + err);
              return res.json(err);
            } else {
              return res.json(doc);
            }
          });
});



router.get('/getRequestListForTopic', function(req, res) {
  Teacher.findOne({_id: req.query.teacher_id}, function(teacher_err, teacher_data) {
    if (teacher_err) {
        console.log('teacher_err: ' + teacher_err);
        return res.status(500).json({
        teacher_err: teacher_err
      });
    } else {
            var teacher_topics = _.map(teacher_data.topics, function(topic_obj) {
              return topic_obj.name;
            });
            console.log('teacher_data: ' + teacher_data);
            console.log('teacher_topics: ' + teacher_topics);
            Request.find({'state': 'pending', 'topic': {$in: teacher_topics}}, function(err, data) {
            if (err) {
              console.log('ERROR: ' + err);
              return res.json(err);
            } else {
              console.log('DATA: ' + data);
              return res.json(data);
            }
          });
    }
  })
});


module.exports = router;