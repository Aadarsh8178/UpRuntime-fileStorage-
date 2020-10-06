/*
 * Primary file for the API
 */
// @TODO fix twilio API and add integrated MongoDB
//Dependencies
var server = require("./lib/server");
var workers = require("./lib/workers");
var cli = require("./lib/cli");
var cluster = require("cluster");
var os = require("os");

//Declare the app
var app = {};
app.init = (callback) => {
  // if we are on master thread,start the background workers and CLI
  if (cluster.isMaster) {
    //Start the Workers
    workers.init();

    //Start the CLI, but make sure it starts last
    setTimeout(() => {
      cli.init();
      callback();
    }, 50);

    //Fork the process equal to the number of cpu so that each thread has a dedicated cpu
    for (var i = 0; i < os.cpus().length; i++) {
      cluster.fork();
    }
  } else {
    //If we are not on the master thread, Start the HTTP server
    server.init();
  }
};

//Self invoking only if required directly
if (require.main === module) {
  app.init(() => {});
}

//Export the app
module.exports = app;
