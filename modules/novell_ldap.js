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
        managerid: object.MANAGERWORKFORCEID
      }
    });

    res.on('end', function(result) {
      callback(employee);
    });
  })
}
