/**
 * Worker-related tasks
 */

//Dependencies
var path = require("path");
var fs = require("fs");
var _data = require("./data");
var http = require("http");
var https = require("https");
var helpers = require("./helpers");
var url = require("url");
var _logs = require("./log");
var debug = require("util").debuglog("workers");

//Instantiate the worker object
var workers = {};
//Lookup all checks get their data,send to a validator
workers.gatherAllChecks = async () => {
  try {
    var checks = await _data.list("checks");
    //read the check data
    if (!checks.length) {
      throw Error;
    }
    var promises = checks.map(async (id) => {
      try {
        var check = await _data.read("checks", id);
        //Pass it to the check validator,and let that function continue or log error as needed
        workers.validateCheckData(check);
      } catch (e) {
        debug(e);
        debug("Error reading one of the check data");
      }
    });
    await Promise.all(promises);
  } catch (e) {
    debug("Error: Could not find any checks to process");
  }
};

//Sanity-check the check-data
workers.validateCheckData = (check) => {
  check = typeof check === "object" && check !== null ? check : {};
  check.id =
    typeof check.id === "string" && check.id.trim().length == 20
      ? check.id.trim()
      : false;
  check.userPhone =
    typeof check.userPhone === "string" && check.userPhone.trim().length == 10
      ? check.userPhone.trim()
      : false;
  check.protocol =
    typeof check.protocol === "string" &&
    ["https", "http"].includes(check.protocol.toLowerCase())
      ? check.protocol
      : false;

  check.url =
    typeof check.url === "string" && check.url.trim().length > 0
      ? check.url
      : false;

  check.method =
    typeof check.method === "string" &&
    ["get", "put", "post", "delete"].includes(check.method.toLowerCase())
      ? check.method
      : false;

  check.successCodes =
    Array.isArray(check.successCodes) && check.successCodes.length > 0
      ? check.successCodes
      : false;

  check.timeoutSeconds =
    typeof check.timeoutSeconds === "number" &&
    check.timeoutSeconds % 1 === 0 &&
    check.timeoutSeconds >= 1 &&
    check.timeoutSeconds <= 5
      ? check.timeoutSeconds
      : false;

  //Set the keys that may not be set (if the workers have never seen this check before)
  check.state =
    typeof check.state === "string" && ["up", "down"].includes(check.state)
      ? check.state
      : "down";
  check.lastChecked =
    typeof check.lastChecked === "number" && check.lastChecked > 0
      ? check.lastChecked
      : false;
  // If all the checks pass,pass the data alogn to the next step in the process
  if (
    check.id &&
    check.userPhone &&
    check.protocol &&
    check.url &&
    check.method &&
    check.successCodes &&
    check.timeoutSeconds
  ) {
    workers.performCheck(check);
  } else {
    debug("Error: one of the check is not properly formatted. Skipping it.");
  }
};
//Perform the check, send the check and the outcome of the check process,the next step in the process
workers.performCheck = (check) => {
  //Prepare the initial check outcome
  var checkOutcome = {
    error: false,
    responseCode: false,
  };

  //Mark that the outcome has not been sent yet
  var outcomeSent = false;

  //Parse the hostname and the path out of the original check data
  var parsedUrl = url.parse(check.protocol + "://" + check.url, true);
  var hostname = parsedUrl.hostname;
  var path = parsedUrl.path; //Using path and not  "pathname" because we want the query string
  var requestDetails = {
    protocol: check.protocol + ":",
    hostname,
    method: check.method.toUpperCase(),
    path,
    timeout: check.timeoutSeconds * 1000,
  };

  //Instantiate the request object (using either the http or https module)
  var _moduleToUse = check.protocol === "http" ? http : https;

  var req = _moduleToUse.request(requestDetails, (res) => {
    var status = res.statusCode;
    //Update the checkOutcome and pass the data along
    checkOutcome.responseCode = status;
    if (!outcomeSent) {
      workers.procesCheckOutcome(check, checkOutcome);
      outcomeSent = true;
    }
  });

  //Bind to the error event so it doesn't get thrown
  req.on("error", (e) => {
    checkOutcome.error = {
      error: true,
      value: e,
    };
    if (!outcomeSent) {
      workers.procesCheckOutcome(check, checkOutcome);
      outcomeSent = true;
    }
  });

  //Bind to the timeout event
  req.on("timeout", (e) => {
    checkOutcome.error = {
      error: true,
      value: "timeout",
    };
    if (!outcomeSent) {
      workers.procesCheckOutcome(check, checkOutcome);
      outcomeSent = true;
    }
  });

  //End the request (same as sending the req)
  req.end();
};

//Process the check outcome,update the check data as needed,trigger an alert if needed
workers.procesCheckOutcome = async (check, checkOutcome) => {
  var state =
    !checkOutcome.error &&
    checkOutcome.responseCode &&
    check.successCodes.includes(checkOutcome.responseCode)
      ? "up"
      : "down";

  //Decide if an alert is warranted
  var alertWarranted =
    check.lastChecked && check.state !== state ? true : false;

  //Log the outcome
  var timeofCheck = Date.now();
  workers.log(check, checkOutcome, state, alertWarranted, timeofCheck);

  //Update the check data
  var newCheckData = check;
  newCheckData.state = state;
  newCheckData.lastChecked = timeofCheck;

  //save the update
  try {
    await _data.update("checks", newCheckData.id, newCheckData);
    if (alertWarranted) {
      workers.alertUserToStatusChanged(newCheckData);
    } else {
      debug("Check outcome has not changed , no alert needed");
    }
  } catch (e) {
    debug("Error trying to save updates to one of the checks");
  }
};

// Alert the user as to a change in their check status
workers.alertUserToStatusChanged = (newCheckData) => {
  var msg = `Alert: Your Check for ${newCheckData.method.toUpperCase()} ${
    newCheckData.protocol
  }://${newCheckData.url} is currently ${newCheckData.state}`;
  helpers.sendTwilioSms(newCheckData.userPhone, msg, (err) => {
    if (!err) {
      debug(
        "Success: User was alerted to a status to a status change in their check,via sms",
        msg
      );
    } else {
      debug(
        "Error: Could not send sms alert to user who had a state change ",
        msg
      );
    }
  });
};

workers.log = async (
  check,
  checkOutcome,
  state,
  alertWarranted,
  timeofCheck
) => {
  var logData = {
    check,
    outcome: checkOutcome,
    state,
    alert: alertWarranted,
    time: timeofCheck,
  };

  //Convert data to a string
  var logString = JSON.stringify(logData);

  //Determine the name of the log file
  var logFileName = check.id;

  //Append the log string to the new file
  try {
    await _logs.append(logFileName, logString);
    debug("logging file succeded");
  } catch (e) {
    debug("Logging to file failed");
  }
};

//Timer to execute the worker-process once per minute
workers.loop = () => {
  setInterval(() => {
    workers.gatherAllChecks();
  }, 1000 * 60);
};

//Rotate (compress) the log files
workers.rotateLogs = async () => {
  //List all the (non compress) log files
  try {
    var logs = await _logs.list(false);
    debug(logs);
    var promises = logs.map(async (logName) => {
      var logId = logName.replace(".log", "");
      var newFileId = logId + "-" + Date.now();
      try {
        await _logs.compress(logId, newFileId);
        await _logs.truncate(logId);
        debug("Sucess trucating log file");
      } catch (e) {
        debug("Error corresponding one of the log files");
      }
    });
    await Promise.all(promises);
  } catch (e) {
    debug(e);
    debug("Error could not find logs to rotate");
  }
};

//Timer to execute log rotation process once per day
workers.logRotationLoops = () => {
  setInterval(() => {
    workers.rotateLogs();
  }, 1000 * 60 * 60 * 24);
};

//Init script
workers.init = () => {
  //Send to console,in yellow
  console.log("\x1b[33m%s\x1b[0m", "Background workers are running");

  //Execute all the checks immediately
  workers.gatherAllChecks();

  //Call the loop so the checks will execute later on
  workers.loop();

  //Compress all the logs immediately
  workers.rotateLogs();

  //Call the compression loop so logs will be compress later on
  workers.logRotationLoops();
};

module.exports = workers;
