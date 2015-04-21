var ldap = require('ldapjs');
var fs = require('fs');
var _ = require('underscore');

var Employee = require('../models/employee');
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'))
var ldap_server = config.novell_ldap_server
var searchBase = 'o=Novell';

var client = ldap.createClient({
  url: ldap_server
});

exports.findById = function (id, callback) {
  var opts = {
    filter: "(WORKFORCEID=" + id + ")",
    scope: 'one'
  };

  client.search(searchBase, opts, function(req, res) {
    var employee = null;

    res.on('searchEntry', function (entry) {
      var object = entry.object
      employee = {
        title: object.title,
        department: object.ou,
        managerid: object.MANAGERWORKFORCEID,
        manager: (entry.object.ISMANAGER == "TRUE")
      }
    });

    res.on('end', function(result) {
      callback(employee);
    });
  })
}

exports.members = function(request, response) {
  var managerid = request.params.id;

  var opts = {
    filter: '(|(WORKFORCEID=' + managerid + ')(MANAGERWORKFORCEID=' + managerid + '))',
    scope: 'sub'
  };

  client.search(searchBase, opts, function(req, res, next) {
    var staff = [];

    res.on('searchEntry', function (entry) {
      employee = {
        id: entry.object.WORKFORCEID,
        uid: entry.object.uid.toLowerCase(),
        cn: entry.object.FULLNAME,
        title: entry.object.title,
        mail: entry.object.mail,
        mobile: entry.object.mobile || entry.object.telephoneNumber,
        telephoneNumber: entry.object.telephoneNumber || entry.object.mobile,
        manager: (entry.object.ISMANAGER == "TRUE")
      }

      staff.push(employee)
    });

    res.on('end', function(result) {
      var employees = []

      staff = _.sortBy(staff, 'name')

      for(i in staff) {
        employees.push(new Employee(staff[i]))
      }

      response.send(employees);
    });
  })
};


