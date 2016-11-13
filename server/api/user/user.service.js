
var User = global.dbHandel.getModel('users');

exports.User = User;

exports.getUserByQuery = function (name, callback) {

  User.find({ name: name }, callback);

};

exports.getUserOne = function(name, callback) {
  User.findOne({ name: name }, callback);
}

exports.getUserById = function (id, callback) {

  User.find({ _id: id }, callback);

};

exports.newAndSave = function (name, password, callback) {

  User.create({ name: name, password: password }, callback);

};
