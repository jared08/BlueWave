var express = require('express');
var router = express.Router();
var Message = require('../models/message.js');
var Request = require('../models/request.js');
var Teacher = require('../models/teacher.js');
var Learner = require('../models/learner.js');

router.get('/getMessages', function(req, res) {
  Request.find({_id: req.query.request_id}, function(err, data) {
      //probably shouldn't return entire user, just topics
      if (err) {
        return res.json(err);
      } else {
        return res.json(data);
      }
    });
});

router.post('/addMessageTeacher', function(req, res) {
	Teacher.findOne({_id: req.body.teacher_id}, function(teacher_err, teacher_data) {
      if (teacher_err) {
          console.log('teacher_err: ' + teacher_err);
          return res.status(500).json({
          teacher_err: teacher_err
        });
      } else {
      	console.log('teacher_data: ' + teacher_data);
      	console.log('teacher_data.name: ' + teacher_data.name);
      	var teacher_name = teacher_data.name;
	  	Request.update({_id: req.body.request_id },
	      {$push: { 'messages' : (new Message({ sender_id: req.body.teacher_id, sender_name: teacher_name, content: req.body.content })) }}, 
	        function(err, data) { 
	        if (err) {
	          console.log('err: ' + err);
	          return res.status(500).json({
	            err: err
	          });
	        }
	        return res.status(200).json({
	          status: 'Added Message!'  
	        });
	      })
		}
	})
});

router.post('/addMessageLearner', function(req, res) {
	Learner.findOne({_id: req.body.learner_id}, function(learner_err, learner_data) {
      if (learner_err) {
          console.log('learner_err: ' + learner_err);
          return res.status(500).json({
          learner_err: learner_err
        });
      } else {
      	console.log('learner_data: ' + learner_data);
      	console.log('learner_data.name: ' + learner_data.name);
      	var learner_name = learner_data.name;
	  	Request.update({_id: req.body.request_id },
	      {$push: { 'messages' : (new Message({ sender_id: req.body.learner_id, sender_name: learner_name, content: req.body.content })) }}, 
	        function(err, data) { 
	        if (err) {
	          console.log('err: ' + err);
	          return res.status(500).json({
	            err: err
	          });
	        }
	        return res.status(200).json({
	          status: 'Added Message!'  
	        });
	      })
		}
	})
});



module.exports = router;