/**
 * CLI-Related Tasks
 */

//Dependencies
var readline = require("readline");
var util = require("util");
var debug = util.debuglog("cli");
var events = require("events");
var os = require("os");
var v8 = require("v8");
var _data = require("./data");
var _logs = require("./logs");
var helpers = require("./helpers");

class _events extends events {}
var e = new _events();

//Instantiate the CLI module object
var cli = {};

//Input handlers
e.on("man", (str) => {
  cli.responders.help();
});

e.on("help", (str) => {
  cli.responders.help();
});

e.on("exit", (str) => {
  cli.responders.exit();
});

e.on("stats", (str) => {
  cli.responders.stats();
});

e.on("list users", (str) => {
  cli.responders.listUsers();
});

e.on("more user info", (str) => {
  cli.responders.moreUserInfo(str);
});

e.on("list checks", (str) => {
  cli.responders.listChecks(str);
});

e.on("more check info", (str) => {
  cli.responders.moreCheckInfo(str);
});

e.on("list logs", (str) => {
  cli.responders.listLogs();
});

e.on("more log info", (str) => {
  cli.responders.moreLogInfo(str);
});

//Responders object
cli.responders = {};

//Help/Man
cli.responders.help = () => {
  var commands = {
    exit: "Kill the CLI (and the rest of application)",
    man: "Show this help page",
    help: 'Alias of the "max" command',
    stats: "Get statistics on the underlying system and resource utilization",
    "list users":
      "Show a list of all the registered (undeleted) users in the system",
    "more user info --{userId}": "Show details of a specific user",
    "list checks --up --down":
      'Show a list of all the active checks,including there state.The "--up" and the "--down" flags are both optional',
    "more check info --{checkId}": "Show details of a specified check",
    "list logs":
      "Show the list of all log files available to be read (compressed only)",
    "more log info --{fileName}": "Show details of a specified log file",
  };

  //Show a header for the help page that is as wide as the screen
  cli.horizontalLine();
  cli.centered("CLI MANUAL");
  cli.horizontalLine();
  cli.verticalSpace(2);

  //Show each command, followed by its explaination in white and yellow respectively
  for (var key in commands) {
    if (commands.hasOwnProperty(key)) {
      var value = commands[key];
      var line = "\x1b[34m" + key + "\x1b[0m";
      var padding = 60 - line.length;
      for (i = 0; i < padding; i++) {
        line += " ";
      }
      line += value;
      console.log(line);
      cli.verticalSpace();
    }
  }
  cli.verticalSpace(1);

  //Ends with another horizontalLine
  cli.horizontalLine();
};

//Create a vertical space
cli.verticalSpace = (lines) => {
  lines = typeof lines === "number" && lines > 0 ? lines : 1;
  for (i = 0; i < lines; i++) {
    console.log("");
  }
};

//Create a horizontal line across the screen
cli.horizontalLine = () => {
  //Get the available screen size
  var width = process.stdout.columns;

  var line = "";
  for (i = 0; i < width; i++) {
    line += "-";
  }
  console.log(line);
};

//Centered text on the screen
cli.centered = (str) => {
  str = typeof str === "string" && str.trim().length > 0 ? str.trim() : "";

  //Get the available screen size
  var width = process.stdout.columns;

  //Calculate the left padding there should be
  var leftPadding = Math.floor(width - str.length) / 2;
  var line = "";
  //Put in left padded spaces before the string itself
  for (i = 0; i < leftPadding; i++) {
    line += " ";
  }
  line += str;
  console.log(line);
};
//Exit
cli.responders.exit = () => {
  process.exit(0);
};

//Stats
cli.responders.stats = () => {
  //Compile an object of stats
  var stats = {
    "Load Average": os.loadavg().join(" "),
    "CPU Count": os.cpus().length,
    "Free Memory": os.freemem(),
    "Current Malloced Memory": v8.getHeapStatistics().malloced_memory,
    "Peak Malloced Memory": v8.getHeapStatistics().peak_malloced_memory,
    "Allocated Heap Used (%)": Math.round(
      (v8.getHeapStatistics().used_heap_size /
        v8.getHeapStatistics().total_heap_size) *
        100
    ),
    "Available Heap Allocated (%)": Math.round(
      (v8.getHeapStatistics().total_heap_size /
        v8.getHeapStatistics().heap_size_limit) *
        100
    ),
    Uptime: os.uptime() + " Seconds",
  };

  //Create a Header for stats
  cli.horizontalLine();
  cli.centered("SYSTEM STATISTICS");
  cli.horizontalLine();
  cli.verticalSpace(2);

  //Log out each stats
  for (var key in stats) {
    if (stats.hasOwnProperty(key)) {
      var value = stats[key];
      var line = "\x1b[34m" + key + "\x1b[0m";
      var padding = 60 - line.length;
      for (i = 0; i < padding; i++) {
        line += " ";
      }
      line += value;
      console.log(line);
      cli.verticalSpace();
    }
  }
  cli.verticalSpace(1);

  //Ends with another horizontalLine
  cli.horizontalLine();
};

//List Users
cli.responders.listUsers = async () => {
  try {
    var userIds = await _data.list("users");
    if (userIds.length) {
      cli.verticalSpace();
      var promises = userIds.map(async (userId) => {
        try {
          var userData = await _data.read("users", userId);
          var line =
            "Name: " +
            userData.firstName +
            " " +
            userData.lastName +
            " Phone: " +
            userData.phone +
            " Checks: ";
          var numberofChecks =
            typeof userData.checks === "object" &&
            userData.checks instanceof Array
              ? userData.checks.length
              : 0;

          line += numberofChecks;
          console.log(line);
          cli.verticalSpace();
        } catch (e) {}
      });
      await Promise.all(promises);
    }
  } catch (e) {}
};

//More user info
cli.responders.moreUserInfo = async (str) => {
  var userId = str.split("--")[1];
  try {
    if (!userId) throw Error;
    userId = userId.substr(1, userId.length - 2);
    var userData = await _data.read("users", userId);
    //Remove the hashed password
    delete userData.hashedPassword;

    //print the JSON with text highlighting
    cli.verticalSpace();
    console.dir(userData, { colors: true });
    cli.verticalSpace();
  } catch (e) {
    console.log("not properly formatted enter help to learn more");
  }
};

//List checks
cli.responders.listChecks = async (str) => {
  try {
    var checkIds = await _data.list("checks");
    cli.verticalSpace();
    var promises = checkIds.map(async (checkId) => {
      try {
        var checkData = await _data.read("checks", checkId);
        var includeCheck = false;
        var lowerString = str.toLowerCase();

        //Get the state, default to down
        var state =
          typeof checkData.state === "string" ? checkData.state : "down";

        //Get the state,default to unknown
        var stateOrUnknown =
          typeof checkData.state === "string" ? checkData.state : "unknown";

        //If the user has specified the state, or hasn't specified any state,include the current check accordingly
        if (
          lowerString.indexOf("--" + state) > -1 ||
          (lowerString.indexOf("--down") === -1 &&
            lowerString.indexOf("--up") === -1)
        ) {
          var line =
            "ID: " +
            checkData.id +
            " " +
            checkData.method.toUpperCase() +
            " " +
            checkData.protocol +
            "://" +
            checkData.url +
            " State: " +
            stateOrUnknown;
          console.log(line);
          cli.verticalSpace();
        }
        await Promise.all(promises);
      } catch (e) {}
    });
  } catch (e) {
    console.log("error while reading checks try again");
  }
};

//More info check
cli.responders.moreCheckInfo = async (str) => {
  var checkId = str.split("--")[1];
  try {
    if (!checkId) throw Error;
    checkId = checkId.substr(1, checkId.length - 2);
    var checkData = await _data.read("checks", checkId);

    //print the JSON with text highlighting
    cli.verticalSpace();
    console.dir(checkData, { colors: true });
    cli.verticalSpace();
  } catch (e) {
    console.log("not properly formatted enter help to learn more");
  }
};

//List logs
cli.responders.listLogs = async () => {
  try {
    var logFileNames = await _logs.list(true); //true is to include compressed files also
    logFileNames.map((logFileName) => {
      if (logFileName.indexOf("-") > -1) {
        console.log(logFileName);
        cli.verticalSpace();
      }
    });
  } catch (e) {}
};

//More log info
cli.responders.moreLogInfo = async (str) => {
  var logFileName = str.split("--")[1];
  try {
    logFileName = logFileName.substr(1, logFileName.length - 2);
    if (!logFileName) throw Error;
    cli.verticalSpace();
    //Decompress the data
    var strData = await _logs.decompress(logFileName);
    //Split into lines
    var arr = strData.split("\n");
    arr.forEach((jsonString) => {
      var logObject = helpers.parseJsonToObject(jsonString);
      if (logObject && JSON.stringify(logObject) !== "{}") {
        console.dir(logObject, { colors: true });
        cli.verticalSpace();
      }
    });
  } catch (e) {
    console.log("not properly formatted enter help to learn more");
  }
};

//Input processor
cli.processInput = (str) => {
  str = typeof str === "string" && str.trim().length > 0 ? str.trim() : false;

  //Only process the input if the user actually wrote something. Otherwise ignore
  if (str) {
    //Codify the unique strings that identify the unique questions allowed to be asked
    var uniqueInputs = [
      "man",
      "help",
      "exit",
      "stats",
      "list users",
      "more user info",
      "list checks",
      "more check info",
      "list logs",
      "more log info",
    ];

    //Go through the possible inputs, emit an event when a match is found
    var matchFound = false;
    var counter = 0;
    uniqueInputs.some((input) => {
      if (str.toLowerCase().indexOf(input) > -1) {
        matchFound = true;
        //Emit an event matching the unique input, and include the full string given by the user
        e.emit(input, str);
        return true;
      }
    });

    //If no match is found, tell the user to try again
    if (!matchFound) {
      console.log("Not supported ,enter help/man to know supported commands");
    }
  }
};

//Init script
cli.init = () => {
  //Send the start message to the console,in dark blue
  console.log("\x1b[34m%s\x1b[0m", "The CLI is running");

  // Start the interface
  var _interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: ">",
  });

  // Create an initial prompt
  _interface.prompt();

  //Handle each line of input separately
  _interface.on("line", (str) => {
    //Send to the input processor
    cli.processInput(str);

    //Re-initialize th promt afterwards
    _interface.prompt();
  });

  //If the user stops the CLI, kill the associated process
  _interface.on("close", () => {
    process.exit(0);
  });
};

//Export the module
module.exports = cli;
