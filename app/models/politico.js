'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Politico = new Schema({
  _id: Schema.Types.ObjectId,
  nome: String,
  cpf: String,
  rg: String,
  dataNascimento: Date,
  idPartido: Number/*{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partido'
  }*/
});

module.exports = mongoose.model('Politico', Politico);