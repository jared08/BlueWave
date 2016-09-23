var express = require('express');
var router = express.Router();

var Learner = require('../models/learner.js');
var Request = require('../models/request.js');  
var Teacher = require('../models/teacher.js'); 
var Message = require('../models/message.js'); 
var _ = require('lodash'); 
var ObjectId = require('mongoose').Types.ObjectId;

router.post('/createRequest', function (req, res) { 
  var date = new Date();

  Request.create({ _id: new ObjectId(), learner_id: req.body.learner_id, state: 'pending', question: req.body.question, 
    topic: req.body.topic, difficulty: req.body.difficulty, contact_method: req.body.contact_method, create_time: date}, 
    function(request_err, request_doc) {
      if (request_err) {
        return res.json(request_err);
      } else {
        console.log('trying to add to learner: ' + request_doc._id);
        Learner.update({_id: req.body.learner_id }, {$push: { 'requests' : request_doc._id }}, function(learner_err, learner_data) { 
          if (learner_err) {
            console.log('err: ' + learner_err);
            return res.json(learner_err);
          } else {
            return res.json(request_doc);
          }          
        })
        
      }
  })
});

router.get('/getRequestInfo', function(req, res) {
  Request.find({_id: req.query.request_id}, function(err, data) {
      if (err) {
        console.log('err: ' + err);
        return res.json(err);
      } else {
        console.log('request info data: ' + data);
        return res.json(data);
      }
    });
});

router.get('/getTeacherInfo', function(req, res) {
  Teacher.find({_id: req.query.teacher_id}, function(err, data) {
      if (err) {
        console.log('err: ' + err);
        return res.json(err);
      } else {
        console.log('data: ' + data);
        return res.json(data);
      }
    });
});

router.get('/getTeacherTopicInfo', function(req, res) {
  Teacher.findOne({_id: req.query.teacher_id}, function(teacher_err, teacher_data) {
      if (teacher_err) {
        console.log('teacher_err: ' + teacher_err);
        return res.json(teacher_err);
      } else {
        console.log('teacher_data.topics: ' + teacher_data.topics);
        for (i = 0; i < teacher_data.topics.length; i++) {
          if (teacher_data.topics[i].name === req.query.topic) {
            return res.json(teacher_data.topics[i]);
          }
        }
        return res.json(teacher_err);
      }
    });
});

router.put('/acceptRequest', function (req, res) {      
  Request.findByIdAndUpdate(req.body.request_id, {teacher_id: req.body.teacher_id}, function (err, doc) {
    if (err) {
      console.log('ERROR: ' + err);
      return res.json(err);
    } else {
      return res.json(doc);
    }
  });
});

router.put('/acceptTeacher', function (req, res) {  
  var learner_id = req.body.learner_id;
  console.log('LEARNER_ID: ' + learner_id);
  Learner.findOne({_id: learner_id}, function(learner_err, learner_data) {
      if (learner_err) {
          return res.status(500).json({
          learner_err: learner_err
        });
      } else {
        console.log('LEARNER DATA: ' + learner_data);
        var date = new Date();
        Request.findByIdAndUpdate(req.body.request_id, {state: 'in_progress', start_time: date,
          $push: { 'messages' : (new Message({ sender_id: learner_id, sender_name: learner_data.name, content: req.body.question })) }},
            function (err, doc) {
              if (err) {
                console.log('ERROR: ' + err);
                return res.json(err);
              } else {
                return res.json(doc);
              }
            });
      }
  });
});

router.put('/rejectTeacher', function (req, res) {
      Request.findByIdAndUpdate(req.body.request_id, {state: 'pending', teacher_id: null}, function (err, doc) {
        if (err) {
              return res.json(err);
            } else {
              return res.json(doc);
            }
          });
});

router.put('/cancelRequest', function (req, res) {
  var date = new Date();
      Request.findByIdAndUpdate(req.body.request_id, {state: 'cancelled', end_time: date}, function (err, doc) {
        if (err) {
              return res.json(err);
            } else {
              return res.json(doc);
            }
          });
});

router.put('/finishRequest', function (req, res) {
  var date = new Date();
      Request.findByIdAndUpdate(req.body.request_id, {state: 'finished', end_time: date, understanding: req.body.understanding,
        teacher_rating: req.body.teacher_rating}, function (err, doc) {
        if (err) {
              return res.json(err);
            } else {
              return res.json(doc);
            }
          });
});



router.get('/getRequestListForTopic', function(req, res) {
  console.log('TRYING TO FIND TOPIC FOR: ' + req.query.teacher_id);
  Teacher.findOne({_id: req.query.teacher_id}, function(teacher_err, teacher_data) {
    if (teacher_err) {
        return res.status(500).json({
        teacher_err: teacher_err
      });
    } else {
      console.log('found: ' + teacher_data);
            var teacher_topics = _.map(teacher_data.topics, function(topic_obj) {
              return topic_obj.name;
            });
            console.log('teacher_topics: ' + teacher_topics);
            Request.find({'state': 'pending', 'topic': {$in: teacher_topics}}, function(err, data) {
            if (err) {
              console.log('Request err: ' + err);
              return res.json(err);
            } else {
              console.log('Request data: ' + data);
              return res.json(data);
            }
          });
    }
  })
});

router.get('/getRequests', function(req, res) {
  Request.find({learner_id: req.query.user_id}, function (learner_err, learner_data) {
    if (learner_err) {
      return res.status(500).json({
        learner_err: learner_err
      });
    } else {
      if (learner_data[0] != null) {
        return res.json(learner_data);
      } else {
        Request.find({teacher_id: req.query.user_id}, function (teacher_err, teacher_data) {
          if (teacher_err) {
            return res.status(500).json({
              teacher_err: teacher_err
            });
          } else {
              return res.json(teacher_data);
          } 
        })     
      }
    }
  })
});


module.exports = router;