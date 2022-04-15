var express = require('express');
var router = express.Router();
var Users = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET users register */
router.get('/register', (req,res,next) => {
  res.render('register');
})

/* POST Create users*/
router.post('/register', (req,res,next) => {
  Users.create(req.body, (err,user) => {
    if(err) return next(err);
    res.redirect('/users');
  })
})

module.exports = router;
