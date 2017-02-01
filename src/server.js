var express = require("express");
var bodyParser  = require('body-parser');
var server = express();

server.use(function(req, res, next) {
	console.log("New ", req.method, " request to: ", req.path);
	next();
});

server.use(bodyParser.json());

function setRoutes(router) {
	server.use("/", router);
	server.use(function(err, req, res, next) {
	  res.statusCode = err["statusCode"];
	  res.json(err["body"]);
	  res.end();
	});
}

function start() {
	server.listen(8888);
	console.log("Server has started");
}

exports.start = start;
exports.setRoutes = setRoutes;
exports.app = server; //for use in API testing
