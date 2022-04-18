var express = require('express');
var router = express.Router();
var Users = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.session);
  res.render('users');
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

/* GET user login */
router.get('/login', (req,res,next) => {
  res.render('login');
})

/* POST Login */
router.post('/login', (req,res,next) => {
  var {email, password} = req.body;
  if(!email || !password){
    res.redirect('/users/login');
  }
  Users.findOne({email}, (err, user) => {
    if(err) return next(err);
    if(!user) {
      return res.redirect('/users/login');
    }
    user.verifyPassword(password, (err, result) => {
      if(err) return next(err);
      if(!result) {
        return res.redirect('/users/login');
      }
      req.session.userId = user.id;
      res.redirect('/users');
    })
  })
})

module.exports = router;
