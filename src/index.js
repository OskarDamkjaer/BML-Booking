var server = require("./server");
var routes = require("./routes");
var db = require("./db");

server.setRoutes(routes.routes);
var connection = db.connect();
server.start(connection);
