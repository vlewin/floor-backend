var ldap = require('ldapjs');
var path = require("path");
var fs = require('fs');
var _ = require('underscore');


function Employee(object, fake) {
  this.id = object.employeeNumber;
  this.username = object.uid;
  this.name = object.cn;

  // this.first_name = object.sn
  // this.last_name = object.givenName
  // this.name = object.sn + ', ' + object.givenName

  this.title = object.employeeType;

  this.email = object.mail;
  this.mobile = object.mobile || 'unknown';
  this.phone = object.telephoneNumber;

  this.location = object.l
  this.room = object.roomNumber;
  this.link = 'http://floor.suse.de/floor.cgi?login=' + this.uid

  if (fake) {
    this.pic = 'https://randomuser.me/api/portraits/thumb/men/' + this.username + '.jpg'
  } else {
    this.pic = 'http://floor.suse.de/gif.cgi/' + this.username
  }
};

var config = JSON.parse(fs.readFileSync('config.json', 'utf8'))
var ldap_server = config.ldap_server
var searchBase = 'ou=people,dc=suse,dc=de';

var client = ldap.createClient({
  url: ldap_server
});


exports.findAll = function (request, response) {
  console.log("*** findAll =>" + JSON.stringify(request.query))

  var search = request.query.search
  var page = parseInt(request.query.page) || 0
  var limit = parseInt(request.query.limit) || 20

  var opts = {
    scope: 'sub',
    sizeLimit: limit * (page + 1)
  };

  if (search) {
    opts['filter'] = '(&(objectClass=person)(|(cn=*' + search + '*)(mail=*' + search + '*)))';
  } else {
    opts['filter'] = '(objectClass=person)';
  }

  console.log(opts)

  client.search(searchBase, opts, function (err, res) {
    var employees = [];
    var res_position = 0

    res.on('searchEntry', function (entry) {
      if (res_position > page * limit) {
        if (employees.length < limit) {
          //console.log(entry.object)
          employees.push(new Employee(entry.object))
        }
      } else {
        res_position++;
      }
    });

    res.on('error', function (err) {
      console.log('Error: ' + err.message)
      response.send(employees);
    });

    res.on('end', function (result) {
      this.removeAllListeners('searchEntry');
      this.removeAllListeners('end');
      this.removeAllListeners('error');
      response.send(employees);
    });

  })
};

exports.findAllFaked = function (request, response) {
  console.log("*** findAllFaked =>" + JSON.stringify(request.query))
  var page = parseInt(request.query.page) || 0
  var limit = parseInt(request.query.limit) || 50

  console.log("page: " + page + ' limit: ' + limit)

  var employees = JSON.parse(fs.readFileSync('fixtures/_employees.json', 'utf8'))

  if (request.query.search) {
    employees = _.select(employees, function (employee) {
      return employee.uid == request.query.search;
    });
  } else {
    var start = page * limit;
    var end = start + limit;

    console.log("range start: " + start + ' range end: ' + end)

    employees = _.sortBy(employees, function (employee) {
      return employee.name
    }).slice(start, end);
  }

  response.send(employees);
};


exports.findById = function (request, response) {
  console.log("*** Find employee with ID: " + request.params.id)

  var opts = {
    filter: "(employeeNumber=" + request.params.id + ")",
    scope: 'one'
  };

  client.search(searchBase, opts, function (req, res, next) {
    var employee = null;

    res.on('searchEntry', function (entry) {
      console.log(entry.object)
      employee = new Employee(entry.object);
    });

    res.on('end', function (result) {
      response.send(employee);
    });
  })

};

exports.findByIdFaked = function (req, res) {
  var id = req.params.id

  console.log('*** findByIdFaked: Requesting employee info for id: ' + id)

  var employees = JSON.parse(fs.readFileSync('fixtures/_employees.json', 'utf8'))
  var employee = _.find(employees, function (employee) {
    return employee.suseid == id;
  });

  res.send(employee);

};


exports.count = function (request, response) {
  client.search(searchBase, {attributes: 'id', scope: 'sub'}, function (req, res, next) {
    var count = 0;

    res.on('searchEntry', function (entry) {
      count++;
    });

    res.on('end', function (result) {
      response.send({count: count});
    });
  })
};
