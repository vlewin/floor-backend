var suse_ldap = require('./suse_ldap');
var novell_ldap = require('./novell_ldap');

exports.findAll = function (request, response) {
  suse_ldap.findAll(request, response)
};

exports.findById = function (request, response) {
  var employee = null;

  // FIXME: use Node's EventEmitter
  // http://rob.conery.io/2012/04/05/cleaning-up-deep-callback-nesting-with-nodes-eventemitter/
  function getSUSEInfo(employee_info) {
    employee = employee_info
  }

  function extendWithNovellInfo(employee_info) {
    for (var attrname in employee_info) { employee[attrname] = employee_info[attrname]; }
    response.send(employee);
  }

  suse_ldap.findById(request.params.id, getSUSEInfo)
  novell_ldap.findById(request.params.id, extendWithNovellInfo)

};

exports.team = function (request, response) {
  novell_ldap.team(request, response)
};


exports.latest = function (request, response) {
  suse_ldap.latest(request, response)
};

exports.count = function (request, response) {
  suse_ldap.count(request, response)
};


