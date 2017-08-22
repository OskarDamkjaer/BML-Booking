var handlers = require("./requesthandlers");
var express = require("express");
var router = express.Router();

router.get("/",         handlers.hello);
router.get("/hej",      handlers.hello);
router.get("/newuser",  handlers.regAccount);
router.get("/users",    handlers.users);
router.get("/account",  handlers.account);

router.post("/adduser", handlers.addAccountErrorHandlingStart,
                        handlers.addAccountStructureCheck,
                        handlers.addAccountValueCheck,
                        handlers.addAccountUserExistsCheck,
                        handlers.checkErrors,
                        handlers.addAccount);
                        
router.post("/login",   handlers.login);
router.post("/logout",  handlers.logout);
                        
//router.use("/", handlers.sendError);

exports.routes = router;