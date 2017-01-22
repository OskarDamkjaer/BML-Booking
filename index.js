var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requesthandlers");
var db = require("./db");

var handle = {};
handle["/"] = requestHandlers.hello;
handle["/hej"] = requestHandlers.hello;
handle["/newuser"] = requestHandlers.regAccount;
handle["/users"] = requestHandlers.users;
handle["/adduser"] = requestHandlers.addAccount;

server.start(router.route, handle);
db.connect();
