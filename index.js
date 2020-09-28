/*
 * Primary file for the API
 */
// @TODO fix twilio API and add integrated MongoDB
//Dependencies
var server = require("./lib/server");
var workers = require("./lib/workers");

//Declare the app
var app = {};

app.init = () => {
  //Start the server
  server.init();

  //Start the Workers
  workers.init();
};

app.init();

//Export the app
module.exports = app;
