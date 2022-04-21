var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req,res,next) {
  res.render('home');
});

/* GET login */
router.get('/login', (req,res,next) => {
  var error = req.flash('error')[0];
  res.render('login', {error});
})

/* GET register */
router.get('/register', (req,res,next) => {
  var error = req.flash('error')[0];
  res.render('register', {error});
})

/* POST register user*/
router.post('/register', (req,res,next) => {
    User.create(req.body, (err,user) => {
      if(err) {
        if(err.index === 0){
          req.flash('error', 'Email is already exist');
          return res.redirect('/users/register');
        }
        if(err.errors.email.name === "ValidatorError") {
          req.flash('error', 'Password is too short');
          return res.redirect('/users/register');
        }
        return res.json({err});
      }
      res.redirect('/users/login');
    })
})

/* POST login user */
router.post('/login', (req,res,next) => {
  var {email,password} = req.body;
  if(!email || !password){
    req.flash('error', 'Email or Password required');
    return res.redirect('/users/login');
  }
  User.findOne({email}, (err, user) => {
    if(err) return next(err);
    if(!user){
      req.flash('error','Email is not Register');
      return res.redirect('/users/login');
    }
    user.verifyPassword(password, (err,result) => {
      if(err) return next(err);
      if(!result){
        req.flash('error', 'Password is not Match');
        return res.redirect('/users/login');
      }
      req.session.userId = user.id;
      res.redirect('/articles');
    })
  })
})

/* GET users logout */
router.get('/logout', (req,res,next) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login');
})
module.exports = router;
