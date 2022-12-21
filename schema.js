const mongoose = require("mongoose");

const postSchema =  new mongoose.Schema({
  name : {type: String},
  location : {type: String},
  likes : {type: Number},
  description : {type: String},
  image: {type: String}
} ,{ timestamps: true });

const postsModel = mongoose.model('users', postSchema);

module.exports = postsModel;
