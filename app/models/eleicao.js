'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Eleicao = new Schema({
  _id: Schema.Types.ObjectId,  
  ano: Number,
  pais: String,
  cargo: String
});

module.exports = mongoose.model('Eleicao', Eleicao);