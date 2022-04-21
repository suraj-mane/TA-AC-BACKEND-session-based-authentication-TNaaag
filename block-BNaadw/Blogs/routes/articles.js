var express = require('express');
var router = express.Router();
var article = require('../models/articles');

/* GET articles */
router.get('/', (req,res,next) => {
  article.find({}, (err,article) => {
    if(err) return next(err);
    res.render('articles', {article});
  })
})

/* GET new form */
router.get('/new', (req,res,next) => {
  res.render('createArticles');
})

/* POST to create new articles*/
router.post('/', (req,res,next) => {
  article.create(req.body, (err,article) => {
    if(err) return next(err);
    res.redirect('/articles');
  })
})

/* get single article*/
router.get('/:slug', (req,res,next) => {
  article.findOne({slug:req.params.slug}, (err,article) => {
    if(err) return next(err);
    res.render('singleArticle', {article: article})
  })
})

/* get article edit */
router.get('/:slug/edit', (req,res,next) => {
  article.findOne({slug: req.params.slug}, (err,article) => {
    if(err) return next(err);
    res.render('editArticle', {article:article});
  })
})

/* POST article update */
router.post('/:slug/edit', (req,res,next) => {
  var slug = req.params.slug;
  article.findOneAndUpdate({slug: req.params.slug}, req.body, (err, article) => {
    if(err) return next(err);
    res.redirect('/articles/'+ slug);
  })
})

/* get article delete */
router.get('/:slug/delete', (req,res,next) => {
  var slug = req.params.slug;
  article.findOneAndDelete({slug:slug}, req.body, (err,article) => {
    if(err) return next(err);
    res.redirect('/articles');
  })
})

/* get article like */
router.get('/:slug/like', (req,res,next) => {
  var slug = req.params.slug;
  article.findOneAndUpdate({slug:slug}, {$inc:{like:1}}, (err,article) => {
    if(err) return next(err);
    res.redirect('/articles/' + slug);
  })
})

module.exports = router;