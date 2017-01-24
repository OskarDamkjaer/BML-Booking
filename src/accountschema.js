var mongoose = require('mongoose');
var bcrypt = require("mongoose-bcrypt");
var Schema = mongoose.Schema;
var AccountSchema = new Schema({
  name:   { type: String },
  email:  { type: String, unique: true },
  pnum:   { type: String, unique: true },
  addr:   { type: String },
  pcode:  { type: Number },
  town:   { type: String },
  passw:  { type: String, bcrypt: true }
});

AccountSchema.plugin(bcrypt);
var AccountModel = mongoose.model('Account', AccountSchema);

function authenticate(pnum, pass, callback) {
  AccountModel.find({ pnum: pnum }, function(err, users) {
    if(err || users.length != 1) {
      //Don't differentiate between wrong ID and wrong password
      callback(false, null);
    } else {
      var user = users[0];
      user.verifyPassw(pass, function(err, valid) {
        if(!err) {
          if(valid) {
            callback(true, user);
          } else {
            callback(false, null);
          }
        } else {
          console.log("Error when verifying password of ", pnum);
          callback(false, null);
        }
      });
    }
  });
}

exports.AccountModel = AccountModel;
exports.authenticate = authenticate;
