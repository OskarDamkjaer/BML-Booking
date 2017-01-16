var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requesthandlers");

var handle = {};
handle["/"] = requestHandlers.hello;
handle["/hej"] = requestHandlers.hello;
handle["/newuser"] = requestHandlers.regAccount;

server.start(router.route, handle);
