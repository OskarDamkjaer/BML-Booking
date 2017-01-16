var exec = require("child_process").exec;

function hello(response) {
  console.log("Requested Hello World page");

  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello World");
  response.end();
}

function regAccount(response) {
  console.log("Requested account registration page");
  exec("cat ./assets/html/userform.html", function (error, stdout, stderr) {
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(stdout);
    response.end();
  });
}

exports.hello = hello;
exports.regAccount = regAccount;
