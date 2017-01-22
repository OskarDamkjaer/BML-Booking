var exec = require("child_process").exec;
var querystring = require("querystring");
var fs = require("fs");
var formidable = require('formidable');
var db = require('./db');
var User = db.User;

function hello(response, request) {
  console.log("Requested Hello World page");

  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello World");
  response.end();
}

function regAccount(response, request) {
  console.log(request);
  console.log(request.length);
  console.log("Requested account registration page");
  exec("cat ./assets/html/userform.html", function (error, stdout, stderr) {
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(stdout);
    response.end();
  });
}

function addAccount(response, request) {
  console.log("Requested to register user");
  //console.log(request);
  var form = new formidable.IncomingForm();
  form.parse(request, function(error, fields, files) {
    console.log(fields);
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("Hej, " + fields.name + "!");
    response.end();
    var user = new User(fields);
    user.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log('Added', user);
      }
    });
  });
};

function users(response, request) {
  console.log("Requested user list page");
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Användare:\n");
  User.find({}, function(err, users) {
    if (err) {
      console.log("Error!", err);
    }
    console.log(users);
    response.write(JSON.stringify(users));
    response.end();
  });
}

exports.hello = hello;
exports.regAccount = regAccount;
exports.users = users;
exports.addAccount = addAccount;
