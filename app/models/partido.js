'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Partido = new Schema({
  nome: String,
  numero: Number
});

module.exports = mongoose.model('Partido', Partido);