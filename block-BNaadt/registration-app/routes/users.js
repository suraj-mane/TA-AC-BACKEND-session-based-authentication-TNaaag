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
  var error = req.flash('error')[0];
  res.render('register', {error});
})

/* POST Create users*/
router.post('/register', (req,res,next) => {
  Users.create(req.body, (err,user) => {
    if(err){
      if(err.index === 0){
        req.flash('error', 'Email is alredy exist');
        return  res.redirect('/users/register');
      }
      if(err.errors.password.name === "ValidatorError"){
        req.flash('error','Password is too short');
        return res.redirect('/users/register');
      }
      return res.json({err});
    }  
    res.redirect('/users/login');
  })
})

/* GET user login */
router.get('/login', (req,res,next) => {
  var error = req.flash('error')[0];
  res.render('login', {error});
})

/* POST Login */
router.post('/login', (req,res,next) => {
  var {email, password} = req.body;
  if(!email || !password){
    req.flash('error', 'Email and Password is require')
    return res.redirect('/users/login');
  }
  Users.findOne({email}, (err, user) => {
    if(err) return next(err);
    if(!user) {
      req.flash('error', 'Email is not register')
      return res.redirect('/users/login');
    }
    user.verifyPassword(password, (err, result) => {
      if(err) return next(err);
      if(!result) {
        req.flash('error', 'Password is not Match')
        return res.redirect('/users/login');
      }
      req.session.userId = user.id;
      res.redirect('/users');
    })
  })
})

module.exports = router;
