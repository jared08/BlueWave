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
        return res.status(500).json({
        learner_err: learner_err
      });
    } else {
        Request.create(new Request({ learner: learner_data, state: 'pending', question: req.body.question, 
          topic: req.body.topic, difficulty: req.body.difficulty, contact_method: req.body.contact_method }), function(err, doc) {
          if (err) {
                  return res.json(err);
                } else {
                  return res.json(doc);
                }
        }); 
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
        //maybe should only search topics array for topic in case someone has a name with a topic in it or something
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

router.delete('/deleteRequest', function (req, res) {
  Request.remove({_id: req.query.request_id}, function(err, doc) {
    if (err) {
      console.log('err: ' + err);
      return res.status(500).json({
        err: err
      });
    }
    return res.status(200).json({
      status: 'Deleted Topic!'  
    });
  })
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
        Request.findByIdAndUpdate(req.body.request_id, {state: 'in_progress', 
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
      Request.findByIdAndUpdate(req.body.request_id, {state: 'pending', teacher_id: null}, function (err, doc) {
        if (err) {
              return res.json(err);
            } else {
              return res.json(doc);
            }
          });
});

router.put('/finishRequest', function (req, res) {
      Request.findByIdAndUpdate(req.body.request_id, {state: 'finished'}, function (err, doc) {
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


module.exports = router;