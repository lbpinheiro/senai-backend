'use strict'

var mongoose = require('mongoose');
var moment = require('moment');
var Url = require('./models/url');
var Partido = require('./models/partido');
var Politico = require('./models/politico');
var Eleicao = require('./models/eleicao');
var Candidato = require('./models/candidato');

module.exports = {
  cadastrarPartido: function(req, res) {
    if (!req.body.hasOwnProperty('nome')) res.send({"msg": "propriedade 'nome' obrigatória", "errorCode": "1"}); 
    else if (req.body.nome.length == 0) res.send({"msg": "propriedade 'nome' deve ser preenchida", "errorCode": "2"});
    else if (!req.body.hasOwnProperty('numero')) res.send({"msg": "propriedade 'numero' obrigatória", "errorCode": "3"}); 
    else if (req.body.numero.length == 0) res.send({"msg": "propriedade 'numero' deve ser preenchida", "errorCode": "4"});
    else if (isNaN(req.body.numero)) res.send({"msg": "propriedade 'numero' deve ser um número", "errorCode": "5"});
    else {
      Partido.find({$or: [ {'nome': req.body.nome}, {'numero': req.body.numero} ]}, function(err, docs) {
        if (docs.length) {
          res.send({"msg": "já existe um partido com mesmo nome e/ou número cadastrado", "errorCode": "6"});
        }
        else {
          var novoPartido = new Partido({"nome": req.body.nome, "numero": req.body.numero});
          novoPartido.save(function(err) {
            if (err) {
              res.send({"msg": "problema na conexão com o banco - salvando partido", "errorCode": "7"});
            } else {
              res.send({"msg": "partido salvo com sucesso"});
            }
          });
        }
      });
    }
  },

  cadastrarPolitico: function(req, res) {
    if (!req.body.hasOwnProperty('nome')) res.send({"msg": "propriedade 'nome' obrigatória", "errorCode": "8"}); 
    else if (req.body.nome.length == 0) res.send({"msg": "propriedade 'nome' deve ser preenchida", "errorCode": "9"});
    else if (!req.body.hasOwnProperty('rg')) res.send({"msg": "propriedade 'rg' obrigatória", "errorCode": "21"}); 
    else if (req.body.rg.length == 0) res.send({"msg": "propriedade 'rg' deve ser preenchida", "errorCode": "22"});
    else if (!req.body.hasOwnProperty('cpf')) res.send({"msg": "propriedade 'cpf' obrigatória", "errorCode": "10"}); 
    else if (req.body.cpf.length == 0) res.send({"msg": "propriedade 'cpf' deve ser preenchida", "errorCode": "11"});
    else if (!req.body.hasOwnProperty('dataNascimento')) res.send({"msg": "propriedade 'dataNascimento' obrigatória", "errorCode": "12"});
    //else if (Object.prototype.toString.call(req.body.dataNascimento) !== '[object Date]') res.send({"msg": "propriedade 'dataNascimento' possui uma data inválida", "errorCode": "13"});
    else if (moment().diff(moment(req.body.dataNascimento), 'years') < 18) res.send({"msg": "não é possível cadastrar políticos menores de 18 anos", "errorCode": "14"});
    else if (!req.body.hasOwnProperty('idPartido')) res.send({"msg": "propriedade 'idPartido' obrigatória", "errorCode": "15"});
    else if (req.body.idPartido.length == 0) res.send({"msg": "propriedade 'idPartido' deve ser preenchida", "errorCode": "16"});
    else if (isNaN(req.body.idPartido)) res.send({"msg": "propriedade 'idPartido' deve ser um número", "errorCode": "17"});
    else {
      Partido.find({'numero': req.body.idPartido}, function(err, docs) {
        if (!docs.length) {
          res.send({"msg": "idPartido " + req.body.idPartido + " ainda não cadastrado", "errorCode": "18"});
        }
        else {
          Politico.find({$or: [ {'rg': req.body.rg}, {'cpf': req.body.cpf} ]}, function(err, docs) {
            if (docs.length) {
              res.send({"msg": "já existe um político cadastrado com mesmo RG e/ou CPF", "errorCode": "19"});
            } else {
              var novoPolitico = new Politico({
                "_id": new mongoose.Types.ObjectId(),
                "nome": req.body.nome,
                "cpf" : req.body.cpf,
                "rg": req.body.rg,
                "dataNascimento": req.body.dataNascimento,
                "idPartido": req.body.idPartido
              });
              novoPolitico.save(function(err) {
                if (err) {
                  res.send({"msg": "problema na conexão com o banco - salvando político", "errorCode": "20"});
                } else {
                  res.send({"msg": "político salvo com sucesso"});
                }
              });
            }
          });

        }
      });
  }
  },

  cadastrarEleicao: function(req, res) {
    if (!req.body.hasOwnProperty('ano')) res.send({"msg": "propriedade 'ano' obrigatória", "errorCode": "23"}); 
    else if (req.body.ano.length == 0 || isNaN(req.body.ano)) res.send({"msg": "propriedade 'ano' deve ser preenchida com um valor numérico", "errorCode": "24"});
    else if (!req.body.hasOwnProperty('pais')) res.send({"msg": "propriedade 'pais' obrigatória", "errorCode": "25"}); 
    else if (req.body.pais.length == 0) res.send({"msg": "propriedade 'pais' deve ser preenchida", "errorCode": "26"});
    else if (!req.body.hasOwnProperty('cargo')) res.send({"msg": "propriedade 'pais' obrigatória", "errorCode": "25"}); 
    else if (req.body.cargo != 'Prefeito' && req.body.cargo != 'Governador' && req.body.cargo != 'Senador' && req.body.cargo != 'Presidente') res.send({"msg": "propriedade 'cargo' deve ser preenchida com Prefeito/Governador/Senador/Presidente", "errorCode": "26"});
    else if (req.body.ano > moment().year()) res.send({"msg": "Não é possível cadastrar uma eleição com ano maior que o ano atual", "errorCode": "27"}); 
    else {
      Eleicao.findOne({'cargo': req.body.cargo, 'pais': req.body.pais.toUpperCase()}).sort({ano: -1}).exec(function(err, result) {
        if (err) {
          res.send({"msg": "problema na conexão com o banco - buscando eleição", "errorCode": "28"});
        }
        else if (result) {
          console.log('result');
          if (req.body.ano >= result.ano + 2) {
            var novaEleicao = new Eleicao({
              "ano": req.body.ano,
              "pais": req.body.pais.toUpperCase(),
              "cargo": req.body.cargo
            });
            novaEleicao.save(function(err) {
              if (err) {
                res.send({"msg": "problema na conexão com o banco - salvando eleicao", "errorCode": "29"});
              } else {
                res.send({"msg": "eleição salva com sucesso"});
              }
            });
          } else {
            res.send({"msg": "não é possível cadastrar a eleição pois a última eleição para este mesmo cargo e país foi a menos de 2 anos", "errorCode": "29"});
          }
        } else {
          var novaEleicao = new Eleicao({
            "_id": new mongoose.Types.ObjectId(),
            "ano": req.body.ano,
            "pais": req.body.pais.toUpperCase(),
            "cargo": req.body.cargo
          });
          novaEleicao.save(function(err) {
            if (err) {
              res.send({"msg": "problema na conexão com o banco - salvando eleicao", "errorCode": "29"});
            } else {
              res.send({"msg": "eleição salva com sucesso"});
            }
          });
        }
      });
    }
  },
  
  cadastrarCandidato: function(req, res) {
    if (!req.body.hasOwnProperty('idPolitico') || req.body.idPolitico.length == 0) res.send({"msg": "propriedade 'idPolitico' obrigatória", "errorCode": "30"}); 
    else if (!req.body.hasOwnProperty('idEleicao') || req.body.idEleicao.length == 0) res.send({"msg": "propriedade 'idEleicao' obrigatória", "errorCode": "31"}); 
    else {
      var partido;
      Politico.findOne({"_id": req.body.idPolitico}).exec(function(err, result) {
        if (err) {
          res.send({"msg": "problema na conexão com o banco - buscando político", "errorCode": "32"});
        } else if (result){
          partido = result.idPartido;
          
        }
        else {
          res.send({"msg": "político não encontrado", "errorCode": "33"});
        }
      });

    }
  }
};