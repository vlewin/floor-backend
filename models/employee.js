module.exports = function Employee(object, fake) {
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
  this.link = 'http://floor.suse.de/floor.cgi?login=' + this.username
  this.manager = object.isManager || false

  if (fake) {
    this.pic = 'https://randomuser.me/api/portraits/thumb/men/' + this.username + '.jpg'
  } else {
    this.pic = 'http://floor.suse.de/gif.cgi/' + this.username
  }
};
