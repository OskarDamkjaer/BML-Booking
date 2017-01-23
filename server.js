var express = require("express");
var server = express();

server.use(function(req, res, next) {
	console.log("New ", req.method, " request to: ", req.path);
	next();
});

function setRoutes(router) {
	console.log(router);
	server.use("/", router);
}

function start() {
	server.listen(8888);
	console.log("Server has started");
}

exports.start = start;
exports.setRoutes = setRoutes
