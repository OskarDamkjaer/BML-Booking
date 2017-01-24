var handlers = require("./requesthandlers");
var express = require("express");
var router = express.Router();

router.get("/",         handlers.hello);
router.get("/hej",      handlers.hello);
router.get("/newuser",  handlers.regAccount);
router.get("/users",    handlers.users);

router.post("/adduser", handlers.addAccount);
console.log(router, "hej");

exports.routes = router;