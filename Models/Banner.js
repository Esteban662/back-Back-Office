const mongoose = require('mongoose');

const imagesSchema= new mongoose.Schema({
  texto: String,
  imgUrl: String
})


module.exports= mongoose.model('carousel-images', imagesSchema)
