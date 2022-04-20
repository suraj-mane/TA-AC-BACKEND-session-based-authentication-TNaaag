var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var slug = require('slug');
var schema = mongoose.Schema;

var articlesSchema = new schema({
  title:{type:String,required:true},
  description:{type:String},
  likes:{type:Number},
  author:{type:String},
  like:{type:Number, default:0},
  slug:{type:String}
},{timestamps:true})

articlesSchema.pre('save', function(next) {
  if(this.title && this.isModified('title')){
    var newTitle = slug(this.title);
    this.slug = newTitle; 
    return next();
  } else {
    next();
  }
})

module.exports = mongoose.model('article', articlesSchema);