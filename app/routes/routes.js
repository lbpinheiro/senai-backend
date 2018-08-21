'use strict'

var api = require('../api');
var path = process.cwd();

module.exports = function(app) {

  app.get('/', function(req, res) {
    res.sendFile(path + '/public/index.html');
  });

  //app.get('/*', api.redirect, api.insertShortenedUrl);

  app.post('/api/0.1/partido', api.cadastrarPartido);

  app.post('/api/0.1/politico', api.cadastrarPolitico);

  app.post('/api/0.1/eleicao', api.cadastrarEleicao);

  app.post('/0.1/candidato', api.cadastrarCandidato);
};