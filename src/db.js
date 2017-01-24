var mongoose = require('mongoose');
var accountschema = require('./accountschema');
var url = 'mongodb://localhost:27017/bokning';
var mongo = null;
mongoose.Promise = global.Promise;

function connect() {
  mongoose.connection.on("connected", function() {
    console.log('Connected to database')
  });
  mongoose.connect(url, function(err) {
    if (err) throw err;
  });
}

exports.User = accountschema.AccountModel;
exports.connect = connect;