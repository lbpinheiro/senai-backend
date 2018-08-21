'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Candidato = new Schema({
  eleicao: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Eleicao'
  },
  politico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Politico'
  }
});

module.exports = mongoose.model('Candidato', Candidato);