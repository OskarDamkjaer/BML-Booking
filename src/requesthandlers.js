var exec = require("child_process").exec;
var querystring = require("querystring");
var fs = require("fs");
var formidable = require('formidable');
var db = require('./db');
var User = db.User;

function hello(req, res) {
  console.log("Requested Hello World page");
  res.write("Hello World");
  res.end();
}

function regAccount(req, res) {
  // console.log(req);
  console.log("Requested account registration page");
  exec("cat ./assets/html/userform.html", function (error, stdout, stderr) {
    res.write(stdout);
    res.end();
  });
}

function addAccount(req, res) {
  console.log("Requested to register user");
  //console.log(req);
  var form = new formidable.IncomingForm();
  form.parse(req, function(error, fields, files) {
    console.log(fields);
    var user = new User(fields);
    user.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log('Added', user);
        res.statusCode = 200;
        res.json({ errors: null, name: user.name });
        res.end();
      }
    });
  });
};

function users(req, res) {
  console.log("Requested user list page");
  // res.writeHead(200, {"Content-Type": "text/plain"});
  res.write("Användare:\n");
  User.find({}, function(err, users) {
    if (err) {
      console.log("Error!", err);
    }
    console.log(users);
    res.write(JSON.stringify(users));
    res.end();
  });
}

exports.hello = hello;
exports.regAccount = regAccount;
exports.users = users;
exports.addAccount = addAccount;
