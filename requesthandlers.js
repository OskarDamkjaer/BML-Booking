var exec = require("child_process").exec;
var querystring = require("querystring");
var fs = require("fs");
var formidable = require('formidable');

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
    fs.appendFile("users.txt", fields.name+"\n\t"
      +fields.email+"\n\t"
      +fields.pnbr+"\n\t"
      +fields.addr+"\n\t"
      +fields.postalcode+"\n\t"
      +fields.town+"\n\t"
      +fields.passw+"\n\n",
      function(err) {
      if (err) {
        console.log("Error while appending users!" + err);
      }
    });
  });
};

function users(response, request) {
  console.log("Requested user list page");
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Användare:\n");
  fs.createReadStream("./users.txt").pipe(response);
}

exports.hello = hello;
exports.regAccount = regAccount;
exports.users = users;
exports.addAccount = addAccount;
