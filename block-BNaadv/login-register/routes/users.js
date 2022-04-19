var express = require('express');
var router = express.Router();
var User = require('../model/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var error = req.flash(error)[0];
  res.render('home',{error});
});

/* GET users user page*/
router.get('/register', (req,res,next) => {
  res.render('register');
})

/* POST users register and create user*/
router.post('/register', (req,res,next) => {
  User.create(req.body, (err, user) => {
    if(err) return next(err);
    res.redirect('/users/login');
  })
})

/* GET users on login*/ 
router.get('/login', (req,res,next) => {
  var error = req.flash('error')[0];
  res.render('login',{error});
})

/* POST user login*/
router.post('/login', (req,res,next) => {
  var {email,password} = req.body;
  if(!email || !password){
    req.flash('error', 'Email or Password require');
    return res.redirect('/users/login');
  }
  User.findOne({email}, (err,user) => {
    if(err) return next(err);
    if(!user) {
      req.flash('error', 'Email is not exist')
      return res.redirect('/users/login');
    }
    user.verifyPassword(password, (err, result) => {
      if(err) return next(err);
      if(!result) {
        req.flash('error', 'Password is not match');
        return res.redirect('/users/login');
      }
      req.flash('error', 'User login sucessful')
      req.session.userId = user.id;
      res.redirect('/users');
    })
  })
})

/* GET logout*/ 
router.get('/logout', (req,res,next) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login');
})
module.exports = router;
