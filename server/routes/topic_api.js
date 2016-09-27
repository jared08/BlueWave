var express = require('express');
var router = express.Router();
var passport = require('passport');

var Teacher = require('../models/teacher.js');
var Topic = require('../models/topic.js');

router.post('/addTopic', function(req, res) {
  Teacher.update({_id: req.body.teacher_id },
      {$push: { 'topics' : (new Topic({ name: req.body.topic, experience: req.body.experience, num_classes: 0, rating: 0})) }}, 
        function(err, data) { 
        if (err) {
          console.log('err: ' + err);
          return res.status(500).json({
            err: err
          });
        }
        return res.status(200).json({
          status: 'Added Topic!'  
        });
      });
});



router.delete('/removeTopic', function (req, res) {
  Teacher.findOne({_id: req.query.teacher_id}, function(teacher_err, teacher_data) {
    if (teacher_err) {
        console.log('teacher_err: ' + teacher_err);
        return res.status(500).json({
        teacher_err: teacher_err
      });
    } else {
        teacher_data.topics.pull({name: req.query.topic});
        teacher_data.save(function(err, data) {
          if (err) {
            console.log('err: ' + err);
            return res.status(500).json({
              err: err
            });
          }
          return res.status(200).json({
            status: 'Deleted Topic!'  
          });
        });
      } 
  })

});

router.get('/getTopicList', function(req, res) {
  console.log('trying to get topic list');
  Teacher.find({_id: req.query.teacher_id}, function(err, data) {
      //probably shouldn't return entire user, just topics
      if (err) {
          console.log('err: ' + err);
          return res.status(500).json({
            err: err
          });
        } else {
        console.log('data: ' + data);
        return res.json(data);
      }
    });
});


module.exports = router;