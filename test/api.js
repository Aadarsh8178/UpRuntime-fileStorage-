/**
 * API Tests
 */

//Dependencies
var app = require("../index");
var assert = require("assert");
var http = require("http");
var config = require("../lib/config");

//Holder for the tests
var api = {};

//Helpers
var helpers = {};
helpers.makeGetRequest = (path, callback) => {
  //Configure the request details
  var requestDetails = {
    protocol: "http:",
    hostname: "localhost",
    port: config.httpPort,
    method: "GET",
    path: path,
    headers: {
      "Content-Type": "application/json",
    },
  };

  //Send the request
  var req = http.request(requestDetails, (res) => {
    callback(res);
  });
  req.end();
};

//The main init() function should be able to run without throwing
api["app init should start without throwing"] = (done) => {
  assert.doesNotThrow(() => {
    app.init((err) => {
      done();
    });
  }, TypeError);
};

//Make a request to /ping
api["/ping should respond to GET with 200"] = (done) => {
  helpers.makeGetRequest("/ping", (res) => {
    assert.strictEqual(res.statusCode, 200);
    done();
  });
};

//Make a request to /api/users
api["/api/users should respond to GET with 400"] = (done) => {
  helpers.makeGetRequest("/api/users", (res) => {
    assert.strictEqual(res.statusCode, 400);
    done();
  });
};

//Make a request to random path
api["A random path should respond to GET with 404"] = (done) => {
  helpers.makeGetRequest("/this/path/shouldnt/exist", (res) => {
    assert.strictEqual(res.statusCode, 404);
    done();
  });
};

//Export the tests to the runner
module.exports = api;
