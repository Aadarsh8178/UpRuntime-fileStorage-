/*
 * Primary file for the API
 */
// @TODO fix twilio API and add integrated MongoDB
//Dependencies
var server = require("./lib/server");
var workers = require("./lib/workers");
var cli = require("./lib/cli");
//Declare the app
var app = {};

app.init = (callback) => {
  //Start the server
  server.init();

  //Start the Workers
  workers.init();

  //Start the CLI, but make sure it starts last
  setTimeout(() => {
    cli.init();
    callback();
  }, 50);
};

//Self invoking only if required directly
if (require.main === module) {
  app.init(() => {});
}

//Export the app
module.exports = app;
