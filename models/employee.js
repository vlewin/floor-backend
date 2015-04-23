module.exports = function Employee(object, fake) {
  try {
    this.id = object.id || object.employeeNumber;
    this.username = object.uid;
    this.name = object.cn;

    this.title = object.title || object.employeeType;

    this.email = object.mail;
    this.mobile = object.mobile;
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
  } catch(error) {
    console.log("ERROR: " + error)
    console.log(object)
  }
};
