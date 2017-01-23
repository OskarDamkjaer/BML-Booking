var server = require("./server");
var routes = require("./routes");
var db = require("./db");

server.setRoutes(routes.routes);
server.start();
db.connect();
