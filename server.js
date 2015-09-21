var express = require('express');
var http = require('http');
var path    = require("path");
var fs = require('fs');
var _ = require('underscore');
var ldap = require('./modules/ldap');
var app = express();
var portNumber = process.env.PORT || 3001;

// app.use(express.static('public'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/", function (request, response) { response.send({ status: 'OK' }); })
app.get('/employees', ldap.findAll);
app.get('/employees/:id([0-9]+)', ldap.findById);
app.get('/employees/:id([0-9]+)/team', ldap.team);
app.get('/employees/newcomers', ldap.newcomers);
app.get('/employees/apprentices', ldap.apprentices);
app.get('/employees/count', ldap.count);

app.use(express.static(__dirname));
app.listen(portNumber);

console.log("Responding server listening on port " + portNumber);



