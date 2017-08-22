var chai = require("chai");
var expect = chai.expect;
var mongoose = require("mongoose");
var user = require("../src/accountschema");
var User = user.AccountModel;
mongoose.Promise = global.Promise;
//db exclusively for testing purposes
mongoose.connect("mongodb://localhost:27017/account_test");
describe("AccountsDB", function() {
  var currentUser = null;
  
  function nestedBeforeEach(done) {
    currentUser = new User({
      name: "Test Name",
      email: "test@mail.xyz",
      pnum: "001298-0076",
      addr: "54 Fake Avenue",
      pcode: "89403",
      town: "Emptyville",
      passw: "s00pr5eCur3",
      phone: "0758482953"
    });
    currentUser.save(function(err) {
      done();
    });
  }
  
  function nestedAfterEach(done) {
    User.find({}, function(err, users) {
      User.remove({}, function() {
        done();
      });
    });
  }
  
  describe("Account Creation", function() {
    
    beforeEach(nestedBeforeEach);
    afterEach(nestedAfterEach);
    
    it("registers a new user", function(done) {
      newUser = new User({
        name: "Test2 Name2",
        email: "test2@mail.xyz",
        pnum: "001298-0276",
        addr: "254 Fake Avenue",
        pcode: "29403",
        town: "Emptytown",
        passw: "m3h5eCur3",
        phone: "0735327548"
      });
      newUser.save(function(err) {
        expect(err).to.be.null;
        expect(newUser.name).to.equal("Test2 Name2");
        expect(newUser.email).to.equal("test2@mail.xyz");
        expect(newUser.pnum).to.equal("001298-0276");
        expect(newUser.addr).to.equal("254 Fake Avenue");
        expect(newUser.pcode).to.equal(29403);
        expect(newUser.town).to.equal("Emptytown");
        expect(newUser.passw).to.not.equal("m3h5eCur3");
        done();
      });
    });
    
    it("salts and hashes passwords", function(done) {
      newUser = new User({
        name: "Test3 '3' Name3",
        email: "t3st@ill.abc",
        pnum: "002346-0616",
        addr: "347 Non Rd",
        pcode: "23473",
        town: "None City",
        passw: "53cR37",
        phone: "7834249517"
      });
      newUser2 = new User({
        name: "Test4 '4' Name4",
        email: "tsagt@idfg.abc",
        pnum: "513582-0654",
        addr: "347 Non Rd",
        pcode: "35463",
        town: "None City",
        passw: "53cR37",
        phone: "8925760183"
      });
      newUser.save(function(err) {
        expect(err).to.be.null;
        newUser2.save(function(err2) {
          expect(err2).to.be.null;
          expect(newUser.passw).to.not.equal("53cR37");
          expect(newUser2.passw).to.not.equal("53cR37");
          expect(newUser.passw).to.not.equal(newUser2.passw);
          done();
        });
      });
    });
    
    it("does not allow two users with the same pnum to be created", function(done) {
      newuser = new User({
        name: "Te3245st Name",
        email: "test@ma45il.xyz",
        pnum: "001298-0076",  //same as earlier record
        addr: "54 Fak345e Avenue",
        pcode: "09103",
        town: "Nowhere Creek",
        passw: "passw123",
        phone: "9382960313"
      });
      newuser.save(function(err) {
        expect(err).to.not.be.null;
        done();
      });
    });
    
    it("does not allow two users with the same email to be created", function(done) {
      newuser = new User({
        name: "Te3245st Name",
        email: "test@mail.xyz",  //same as earlier record
        pnum: "034658-3576",
        addr: "54 Fak345e Avenue",
        pcode: "09103",
        town: "Nowhere Creek",
        passw: "passw123",
        phone: "8593028529"
      });
      newuser.save(function(err) {
        expect(err).to.not.be.null;
        done();
      });
    });
    //endfsadsaf
  });
  
  describe("Authentication", function() {
    
    beforeEach(function(done) {
      nestedBeforeEach(done);
    });
    
    afterEach(function(done) {
      nestedAfterEach(done);
    });
    
    it("authenticates user with correct password", function(done) {
      user.authenticate(currentUser.pnum, "s00pr5eCur3", function(status, authUser) {
        expect(status).to.equal(true);
        expect(authUser.name).to.equal(currentUser.name);
        expect(authUser.email).to.equal(currentUser.email);
        expect(authUser.pnum).to.equal(currentUser.pnum);
        expect(authUser.addr).to.equal(currentUser.addr);
        expect(authUser.pcode).to.equal(currentUser.pcode);
        expect(authUser.town).to.equal(currentUser.town);
        expect(authUser.passw).to.equal(currentUser.passw);
        done();
      });
    });
    
    it("denies user with incorrect password", function(done) {
      user.authenticate(currentUser.pnum, "wrongpass", function(status, authUser) {
        expect(status).to.equal(false);
        expect(authUser).to.be.null;
        done();
      });
    });
    
    it("does not differentiate between nonexistent ID and incorrect password", function(done) {
      user.authenticate(currentUser.pnum, "wrongpass", function(status, authUser) {
        user.authenticate("845299-8080", "userdoesnotexist", function(status2, authUser2) {
          expect(status).to.equal(status2);
          expect(authUser).to.equal(authUser2);
          done();
        });
      });
    });
    
  });
  
});

var chaiHttp = require("chai-http");
chai.use(chaiHttp);
var server = require("../src/server");
var routes = require("../src/routes");
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var sessionStore = new mongoStore({
  mongooseConnection: mongoose.connection,
  collection: 'sessions' // default
});
server.start(sessionStore);
server.setRoutes(routes.routes);

describe("User Account REST API", function() {
  var currentUser = null;
  
  function nestedBeforeEach(done) {
    currentUser = new User({
      name: "Test Name",
      email: "test@mail.xyz",
      pnum: "001298-0076",
      addr: "54 Fake Avenue",
      pcode: "89403",
      town: "Emptyville",
      passw: "s00pr5eCur3",
      phone: "8493820619"
    });
    currentUser.save(function(err) {
      done();
    });
  }
  
  function nestedAfterEach(done) {
    User.remove({}, function() {
      sessionStore.clear(function(err) {
        done();
      });
    });
  }
  
  describe("User Registration", function() {
    
    beforeEach(nestedBeforeEach);
    afterEach(nestedAfterEach);
  
    it("should add users with POST /adduser", function(done) {
      var newUser = {
        name: "Test2 N45ame",
        email: "t3st@email.abc",
        pnum: "873457-8954",
        addr: "1010 Binary Way",
        pcode: "98351",
        town: "Digiville",
        passw: "l33th4xxp455",
        phone: "9350194828"
      }
      var expected = { 
        errors: null,
        name: newUser.name 
      };
      chai.request(server.app)
        .post("/adduser")
        .send(newUser)
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal(expected);
          User.find({ name: newUser.name }, function(err, users) {
            expect(err).to.be.null;
            expect(users[0]).to.have.property("name", newUser.name);
            done();
          });
        });
    });
  
    it("should not register users with bad request structure", function(done) {
      var newUser = {
        name: "Test2 N45ame",
        email: "t3st@email.abc",
        pnum: "873457-8954",
        addr: "1010 Binary Way",
        town: "Digiville",
        passw: "l33th4xxp455",
        extraProp: "incorrect",
        phone: "5989381069"
      };
      var expected = { 
        errors: {
          missing:  [ 'pcode' ],
          extra:    [ 'extraProp' ],
          'bad value':  null,
          'user already exists':  null
        },
        name: null 
      };
      chai.request(server.app)
        .post("/adduser")
        .send(newUser)
        .end(function(err, res) {
          expect(err).to.not.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.deep.equal(expected);
          User.find({ name: newUser.name }, function(err, users) {
            expect(users).to.be.empty;
            done();
          });
        });
    });
  
    it("should not register users with impossible email or personal number",  function(done) {
      var newUser = {
        name: "Test2 N45ame",
        email: "t3st.email.abc",  //no @
        pnum: "873457-89547",     //extra digit
        addr: "1010 Binary Way",
        pcode: "23457",
        town: "Digiville",
        passw: "l33th4xxp455",
        phone: "7483921059"
      };
      var expected = { 
        errors: {
          missing: null,
          extra:   null,
          'bad value': [ "email", "pnum" ],
          'user already exists':  null
        },
        name: null 
      };
      chai.request(server.app)
        .post("/adduser")
        .send(newUser)
        .end(function(err, res) {
          expect(err).to.not.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.deep.equal(expected);
          User.find({ name: newUser.name }, function(err, users) {
            expect(users).to.be.empty;
            done();
          });
        });
    });
  
    it("should not register users with the same email or personal number",  function(done) {
      var newUser = {
        name: "Test2 N45ame",
        email: "t3st@email.abc",
        pnum: "001298-0076", //same as previous user
        addr: "1010 Binary Way",
        pcode: "89532",
        town: "Digiville",
        passw: "l33th4xxp455",
        phone: "8549395719"
      };
      var newUser2 = {
        name: "Test2 N45ame",
        email: "test@mail.xyz", //same as previous user 
        pnum: "324561-7363",
        addr: "1010 Binary Way",
        pcode: "89532",
        town: "Digiville",
        passw: "l33th4xxp455",
        phone: "4920693819"
      };
      var expected1 = { 
        errors: {
          missing:      null,
          extra:        null,
          'bad value':  null,
          'user already exists':  [ "pnum" ]
        },
        name: null 
      };
      var expected2 = { 
        errors: {
          missing:      null,
          extra:        null,
          'bad value':  null,
          'user already exists':  [ "email" ]
        },
        name: null 
      };
      chai.request(server.app)
        .post("/adduser")
        .send(newUser)
        .end(function(err, res) {
          expect(err).to.not.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.deep.equal(expected1);
          User.find({ name: newUser.name }, function(err, users) {
            expect(err).to.be.null;
            expect(users).to.be.empty;
            chai.request(server.app)
              .post("/adduser")
              .send(newUser2)
              .end(function(err, res) {
                expect(err).to.not.be.null;
                expect(res).to.have.status(400);
                expect(res.body).to.deep.equal(expected2);
                User.find({ name: newUser2.name }, function(err, users) {
                  expect(err).to.be.null;
                  expect(users).to.be.empty;
                  done();
                });
              });
          });
        });
    });
  
  });
  
  describe("Login", function() {
    
    beforeEach(nestedBeforeEach);
    afterEach(nestedAfterEach);
    
    it("should let people with the right credentials log in", function(done) {
      chai.request(server.app).post("/login")
      .send({
        pnum: currentUser.pnum,
        passw: "s00pr5eCur3"
      }).end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
    });
    
    it("should deny login with incorrect password", function(done) {
      chai.request(server.app).post("/login")
      .send({
        pnum: currentUser.pnum,
        passw: "badpass"
      }).end(function(err, res) {
        expect(err).to.not.be.null;
        expect(res).to.have.status(401);
        done();
      });
    });
    
    it("should deny login with incorrect pnum", function(done) {
      chai.request(server.app).post("/login")
      .send({
        pnum: "496262-8693",
        passw: "s00pr5eCur3"
      }).end(function(err, res) {
        expect(err).to.not.be.null;
        expect(res).to.have.status(401);
        done();
      });
    });
    
    it("should not differentiate between incorrect password and missing user", function(done) {
      chai.request(server.app).post("/login")
      .send({
        pnum: currentUser.pnum,
        passw: "badpass"
      }).end(function(err1, res1) {
        chai.request(server.app).post("/login")
        .send({
          pnum: "496262-8693",
          passw: "s00pr5eCur3"
        }).end(function(err2, res2) {
          expect(res1.status).to.equal(res2.status);
          expect(res1.body).to.deep.equal(res2.body);
          done();
        });
      });
    });
    
    it("should set a session cookie on successful login", function(done) {
      chai.request(server.app).post("/login")
      .send({
        pnum: currentUser.pnum,
        passw: "s00pr5eCur3"
      }).end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.headers['set-cookie'].pop()).to.not.be.null;
        done();
      });
    });
    
    it("should display user info when logged in", function(done) {
      chai.request(server.app).post("/login")
      .send({
        pnum: currentUser.pnum,
        passw: "s00pr5eCur3"
      }).end(function(err, res) {
        var cookie = res.headers['set-cookie'].pop().split(';')[0];
        var req = chai.request(server.app).get("/account")
        req.cookies = cookie;
        req.end(function(err, res) {
          var userCopy = JSON.parse(JSON.stringify(currentUser));
          delete userCopy.passw;
          expect(res.body.accountinfo).to.deep.equal(userCopy);
          done();
        });
      });
    });
    
    it("should allow manual logout", function(done) {
      chai.request(server.app).post("/login")
      .send({
        pnum: currentUser.pnum,
        passw: "s00pr5eCur3"
      }).end(function(err, res) {
        var cookie = res.headers['set-cookie'].pop().split(';')[0];
        sessionStore.collection.count(function(err, count) {
          expect(count).to.equal(1);
          var req = chai.request(server.app).post("/logout")
          req.cookies = cookie;
          req.end(function(err, res) {
            expect(err).to.be.null;
            sessionStore.collection.count(function(err, count) {
              expect(count).to.equal(0);
              done();
            });
          });
        });
      });
    });
  });
  
});











