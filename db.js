var mongoose = require('mongoose');
var accountschema = require('./accountschema');
var url = 'mongodb://localhost:27017/bokning';
var mongo = null;
mongoose.Promise = global.Promise;

function connect() {
  mongoose.connect(url);
  console.log('Connected to database')
}

exports.User = accountschema.AccountModel;
exports.connect = connect;