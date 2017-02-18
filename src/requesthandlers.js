var exec = require("child_process").exec;
var querystring = require("querystring");
var fs = require("fs");
var formidable = require('formidable');
var db = require('./db');
var User = db.User;
var schema = require('./accountschema');

function hello(req, res) {
  console.log("Requested Hello World page");
  res.write("Hello World");
  res.end();
}

function regAccount(req, res) {
  console.log("Requested account registration page");
  exec("cat ./assets/html/userform.html", function (error, stdout, stderr) {
    res.write(stdout);
    res.end();
  });
}

function addAccountErrorHandlingStart(req, res, next) {
  //passes this object to all other functions in the middleware chain
  res.locals.errors = {
    missing: null,
    extra: null,
    "bad value": null,
    "user already exists": null
  };
  next();
}

function addAccountStructureCheck(req, res, next) {
  var correctStructure = {
    name:   null,
    email:  null,
    pnum:   null,
    addr:   null,
    pcode:  null,
    town:   null,
    passw:  null,
    phone:  null
  }
  for(key in req.body) {
    if(correctStructure.hasOwnProperty(key)) {
      correctStructure[key] = req.body[key];
    } else {
      if(res.locals.errors["extra"] == null) {
        res.locals.errors["extra"] = [];
      }
      res.locals.errors["extra"].push(key);
    }
  }
  for(key in correctStructure) {
    if(correctStructure[key] == null) {
      if(res.locals.errors["missing"] == null) {
        res.locals.errors["missing"] = [];
      }
      res.locals.errors["missing"].push(key);
    }
  }
  next();
}


function addAccountValueCheck(req, res, next) {
  var acceptableValues = {
    name:   /(\w+ )+\w+/,
    //don't try to figure the email out, it works..
    email:  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    pnum:   /^[0-9]{6}\-[0-9]{4}$/,
    addr:   /^((\w+\s*)+\d+|\d+(\w+\s*)+)$/,
    pcode:  /^\d{5}$/,
    town:   /^[\w\s]+$/,
    passw:  /^.*$/
  }
  for(key in req.body) {
    if(acceptableValues.hasOwnProperty(key) && !acceptableValues[key].test(req.body[key])) {
      if(res.locals.errors["bad value"] == null) {
        res.locals.errors["bad value"] = [];
      }
      res.locals.errors["bad value"].push(key);
    }
  }
  next();
}

function addAccountUserExistsCheck(req, res, next) {
  if(req.body.hasOwnProperty("pnum")) {    
    User.find({ pnum: req.body["pnum"] }, function(err, users) {
      if (users.length > 0) {
        if(res.locals.errors["user already exists"] == null) {
          res.locals.errors["user already exists"] = [];
        }
        res.locals.errors["user already exists"].push("pnum");
      }
      if(req.body.hasOwnProperty("email")) {
        User.find({ email: req.body["email"] }, function(err, users) {
          if (users.length > 0) {
            if(res.locals.errors["user already exists"] == null) {
              res.locals.errors["user already exists"] = [];
            }
            res.locals.errors["user already exists"].push("email");
          }
          next();
        });
      }
    });
  }
}

function checkErrors(req, res, next) {
  var containsError = false;
  for(key in res.locals.errors) {
    if(res.locals.errors[key] != null) {
      containsError = true;
    }
  }
  if(containsError) {
    next({ statusCode: 400, body: { errors: res.locals.errors, name: null } });
  } else {
    next();
  }
}

function addAccount(req, res) {
  console.log("Request to register user");
  var user = new User(req.body);
  user.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Added');
      res.statusCode = 200;
      res.json({ errors: null, name: user.name });
      res.end();
    }
  });
};

function users(req, res) {
  console.log("Requested user list page");
  res.write("Användare:\n");
  User.find({}, function(err, users) {
    if (err) {
      console.log("Error!", err);
    }
    console.log(users);
    res.write(JSON.stringify(users));
    res.end();
  });
}

function sendError(err, req, res, next) {
  res.statusCode = err["statusCode"];
  res.json(err["body"]);
  res.end();
  return next();
}

function login(req, res) {
  schema.authenticate(req.body.pnum, req.body.passw, function(status, authUser) {
    if(status) {
      req.user = authUser.toObject();
      delete req.user.passw
      req.session.user = req.user;
      res.statusCode = 200;
    } else {
      res.statusCode = 401;
    }
    res.end();
  });
}

function accountInfo(req, res) {
  if (req.session) {
    res.statusCode = 200;
    res.json({accountinfo: req.session.user });
    res.end();
  } else {
    res.statusCode = 401;
    res.end();
  }
}

function logout(req, res) {
  if (req.session) {
    req.session.destroy();
    res.statusCode = 200;
  } else {
    res.statusCode = 401;
  }
  res.end();
}

exports.hello = hello;
exports.regAccount = regAccount;
exports.users = users;
exports.addAccount = addAccount;
exports.addAccountErrorHandlingStart = addAccountErrorHandlingStart;
exports.addAccountStructureCheck = addAccountStructureCheck;
exports.addAccountValueCheck = addAccountValueCheck;
exports.addAccountUserExistsCheck = addAccountUserExistsCheck;
exports.checkErrors = checkErrors;
exports.login = login;
exports.account = accountInfo;
exports.logout = logout;