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
  
  beforeEach(function(done) {
    currentUser = new User({
      name: "Test Name",
      email: "test@mail.xyz",
      pnum: "001298-0076",
      addr: "54 Fake Avenue",
      pcode: "89403",
      town: "Emptyville",
      passw: "s00pr5eCur3"
    });
    currentUser.save(function(err) {
      done();
    });
  });
  
  afterEach(function(done) {
    User.find({}, function(err, users) {
      User.remove({}, function() {
        done();
      });
    });
  });
  
  it("registers a new user", function(done) {
    newUser = new User({
      name: "Test2 Name2",
      email: "test2@mail.xyz",
      pnum: "001298-0276",
      addr: "254 Fake Avenue",
      pcode: "29403",
      town: "Emptytown",
      passw: "m3h5eCur3"
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
      passw: "53cR37"
    });
    newUser2 = new User({
      name: "Test4 '4' Name4",
      email: "tsagt@idfg.abc",
      pnum: "513582-0654",
      addr: "347 Non Rd",
      pcode: "35463",
      town: "None City",
      passw: "53cR37"
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
  
  it("does not allow two users with the same pnum to be created", function(done) {
    newuser = new User({
      name: "Te3245st Name",
      email: "test@ma45il.xyz",
      pnum: "001298-0076",  //same as earlier record
      addr: "54 Fak345e Avenue",
      pcode: "09103",
      town: "Nowhere Creek",
      passw: "passw123"
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
      passw: "passw123"
    });
    newuser.save(function(err) {
      expect(err).to.not.be.null;
      done();
    });
  });
});