const mongoose = require('mongoose');

const categoriaSchema =  new mongoose.Schema({
    categoria:String
  })


const categoriaModel = mongoose.model('new-categories', categoriaSchema);

module.exports = categoriaModel;