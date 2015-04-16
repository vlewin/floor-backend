var express = require('express');
var http = require('http');
var path    = require("path");
var fs = require('fs');

var _ = require('underscore');


var employees = require('./routes/employees');
var portNumber = 3001;

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



app.get("/", function (request, response) {
  console.log("status")
  response.send({ status: 'OK' });
})

// app.get('/employees', employees.findAll);
// app.get('/employees/:id', employees.findById);

app.get('/employees', employees.findAllFaked);
app.get('/employees/:id', employees.findByIdFaked);
app.get('/count', employees.count);

app.use(express.static(__dirname));
app.listen(portNumber);

console.log("Responding server listening on port " + portNumber);



