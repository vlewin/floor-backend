var suse_ldap = require('./suse_ldap');
var novell_ldap = require('./novell_ldap');

exports.findAll = function (request, response) {
  console.log('\nStarted GET "' + request.originalUrl + '"  ')
  console.log('Parameters: ' + JSON.stringify(request.params))
  suse_ldap.findAll(request, response)
};

exports.findById = function (request, response) {
  console.log('\nStarted GET "' + request.originalUrl + '"  ')
  console.log('Parameters: ' + JSON.stringify(request.params))

  var employee = null;

  // FIXME: use Node's EventEmitter
  // http://rob.conery.io/2012/04/05/cleaning-up-deep-callback-nesting-with-nodes-eventemitter/
  function getSUSEInfo(employee_info) {
    employee = employee_info
  }

  function extendWithNovellInfo(employee_info) {
    for (var attrname in employee_info) {
      if(employee_info[attrname]) {
        // console.log("Set '"+ attrname + "' from: " + employee[attrname]+  ' to: ' + employee_info[attrname])
        employee[attrname] = employee_info[attrname];
      }
    }

    response.send(employee);
  }

  suse_ldap.findById(request.params.id, getSUSEInfo)
  novell_ldap.findById(request.params.id, extendWithNovellInfo)

};

exports.team = function (request, response) {
  console.log('\nStarted GET "' + request.originalUrl + '"  ')
  console.log('Parameters: ' + JSON.stringify(request.params))

  novell_ldap.team(request, response)
};


exports.latest = function (request, response) {
  console.log('\nStarted GET "' + request.originalUrl + '"  ')
  console.log('Parameters: ' + JSON.stringify(request.params))
  suse_ldap.latest(request, response)
};

exports.count = function (request, response) {
  console.log('\nStarted GET "' + request.originalUrl + '"  ')
  console.log('Parameters: ' + JSON.stringify(request.params))
  suse_ldap.count(request, response)
};


