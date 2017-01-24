var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AccountSchema = Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  pnum: {
    type: String
  },
  addr: {
    type: String
  },
  pcode: {
    type: Number
  },
  town: {
    type: String
  },
  passw: {
    type: String
  }
});

function authenticate(pnum, pass, callback) {
  callback();
}

var AccountModel = mongoose.model('Account', AccountSchema);

exports.AccountModel = AccountModel;
exports.authenticate = authenticate;
