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

var AccountModel = mongoose.model('Account', AccountSchema);

exports.AccountModel = AccountModel;
