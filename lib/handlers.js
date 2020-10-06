/*
 * Request handlers
 */
//Dependencies
var _data = require("./data");
var helpers = require("./helpers");
var config = require("./config");
var _url = require("url");
var { performance, PerformanceObserver } = require("perf_hooks");
var util = require("util");
var debug = util.debuglog("performance");
var { Resolver } = require("dns").promises;
var resolver = new Resolver();
//define handlers
var handlers = {};

/**
 * HTML Handlers
 */

//Index handler
handlers.index = async (data, callback) => {
  //Reject any request that isn't a GET
  if (data.method === "get") {
    //Prepare data for interpolation
    var templateData = {
      "head.title": "Uptime Monitoring - Made Simple",
      "head.description":
        "We offer free,simple uptime monitoring for HTTP/HTTPS site of all kinds. When your site goes down, we'll send you a text to let you know",
      "body.class": "index",
    };
    try {
      //Read in a template as a string
      var str = await helpers.getTemplate("index", templateData);
      //Add the universal header as a string
      helpers.addUniversalTemplates(str, templateData, (err, str) => {
        if (!err && str) {
          //Return that page as HTML
          callback(200, str, "html");
        } else {
          throw Error;
        }
      });
    } catch (e) {
      callback(500, undefined, "html");
    }
  } else {
    callback(405, undefined, "html");
  }
};

//Create Account Handler
handlers.accountCreate = async (data, callback) => {
  if (data.method === "get") {
    //Prepare data for interpolation
    var templateData = {
      "head.title": "Create an Account",
      "head.description": "Signup is easy and only takes a few seconds",
      "body.class": "accountCreate",
    };
    try {
      //Read in a template as a string
      var str = await helpers.getTemplate("accountCreate", templateData);
      //Add the universal header as a string
      helpers.addUniversalTemplates(str, templateData, (err, str) => {
        if (!err && str) {
          //Return that page as HTML
          callback(200, str, "html");
        } else {
          throw Error;
        }
      });
    } catch (e) {
      callback(500, undefined, "html");
    }
  } else {
    callback(405, undefined, "html");
  }
};

//Create a session (login)
handlers.sessionCreate = async (data, callback) => {
  if (data.method === "get") {
    //Prepare data for interpolation
    var templateData = {
      "head.title": "Login to your Account",
      "head.description":
        "Please enter your phone number and password to access your account",
      "body.class": "sessionCreate",
    };
    try {
      //Read in a template as a string
      var str = await helpers.getTemplate("sessionCreate", templateData);
      //Add the universal header as a string
      helpers.addUniversalTemplates(str, templateData, (err, str) => {
        if (!err && str) {
          //Return that page as HTML
          callback(200, str, "html");
        } else {
          throw Error;
        }
      });
    } catch (e) {
      callback(500, undefined, "html");
    }
  } else {
    callback(405, undefined, "html");
  }
};

//Delete a Session (logout)
handlers.sessionDeleted = async (data, callback) => {
  if (data.method === "get") {
    //Prepare data for interpolation
    var templateData = {
      "head.title": "Logged out",
      "head.description": "You have been Logged out",
      "body.class": "sessionDeleted",
    };
    try {
      //Read in a template as a string
      var str = await helpers.getTemplate("sessionDeleted", templateData);
      //Add the universal header as a string
      helpers.addUniversalTemplates(str, templateData, (err, str) => {
        if (!err && str) {
          //Return that page as HTML
          callback(200, str, "html");
        } else {
          throw Error;
        }
      });
    } catch (e) {
      callback(500, undefined, "html");
    }
  } else {
    callback(405, undefined, "html");
  }
};

//Edit Account
handlers.accountEdit = async (data, callback) => {
  if (data.method === "get") {
    //Prepare data for interpolation
    var templateData = {
      "head.title": "Account Settings",
      "body.class": "accountEdit",
    };
    try {
      //Read in a template as a string
      var str = await helpers.getTemplate("accountEdit", templateData);
      //Add the universal header as a string
      helpers.addUniversalTemplates(str, templateData, (err, str) => {
        if (!err && str) {
          //Return that page as HTML
          callback(200, str, "html");
        } else {
          throw Error;
        }
      });
    } catch (e) {
      callback(500, undefined, "html");
    }
  } else {
    callback(405, undefined, "html");
  }
};

//Account has been deleted
handlers.accountDeleted = async (data, callback) => {
  if (data.method === "get") {
    //Prepare data for interpolation
    var templateData = {
      "head.title": "Account Deleted",
      "head.description": "Your account has been deleted",
      "body.class": "accountDeleted",
    };
    try {
      //Read in a template as a string
      var str = await helpers.getTemplate("accountDeleted", templateData);
      //Add the universal header as a string
      helpers.addUniversalTemplates(str, templateData, (err, str) => {
        if (!err && str) {
          //Return that page as HTML
          callback(200, str, "html");
        } else {
          throw Error;
        }
      });
    } catch (e) {
      callback(500, undefined, "html");
    }
  } else {
    callback(405, undefined, "html");
  }
};

//Creating a new check
handlers.checksCreate = async (data, callback) => {
  if (data.method === "get") {
    //Prepare data for interpolation
    var templateData = {
      "head.title": "Create a New Check",
      "body.class": "checksCreate",
    };
    try {
      //Read in a template as a string
      var str = await helpers.getTemplate("checksCreate", templateData);
      //Add the universal header as a string
      helpers.addUniversalTemplates(str, templateData, (err, str) => {
        if (!err && str) {
          //Return that page as HTML
          callback(200, str, "html");
        } else {
          throw Error;
        }
      });
    } catch (e) {
      callback(500, undefined, "html");
    }
  } else {
    callback(405, undefined, "html");
  }
};

//Dashboard (view all checks)
handlers.checksList = async (data, callback) => {
  if (data.method === "get") {
    //Prepare data for interpolation
    var templateData = {
      "head.title": "Dashboard",
      "body.class": "checksList",
    };
    try {
      //Read in a template as a string
      var str = await helpers.getTemplate("checksList", templateData);
      //Add the universal header as a string
      helpers.addUniversalTemplates(str, templateData, (err, str) => {
        if (!err && str) {
          //Return that page as HTML
          callback(200, str, "html");
        } else {
          throw Error;
        }
      });
    } catch (e) {
      callback(500, undefined, "html");
    }
  } else {
    callback(405, undefined, "html");
  }
};

//Edit a check
handlers.checksEdit = async (data, callback) => {
  if (data.method === "get") {
    //Prepare data for interpolation
    var templateData = {
      "head.title": "Check Details",
      "body.class": "checksEdit",
    };
    try {
      //Read in a template as a string
      var str = await helpers.getTemplate("checksEdit", templateData);
      //Add the universal header as a string
      helpers.addUniversalTemplates(str, templateData, (err, str) => {
        if (!err && str) {
          //Return that page as HTML
          callback(200, str, "html");
        } else {
          throw Error;
        }
      });
    } catch (e) {
      callback(500, undefined, "html");
    }
  } else {
    callback(405, undefined, "html");
  }
};

//favicon
handlers.favicon = async (data, callback) => {
  if (data.method === "get") {
    //Read the favicon'data
    try {
      var data = await helpers.getStaticAsset("favicon.ico");
      callback(200, data, "favicon");
    } catch (e) {
      callback(500);
    }
  } else {
    callback(405);
  }
};

//Public assests
handlers.public = async (data, callback) => {
  if (data.method === "get") {
    var trimmedAssetName = data.trimmedPath.replace("public/", "").trim();
    try {
      if (trimmedAssetName.length <= 0) {
        throw Error;
      }
      var data = await helpers.getStaticAsset(trimmedAssetName);
      //Determin the content type (default to plain text)

      var contentType = "plain";
      if (trimmedAssetName.indexOf(".css" > -1)) {
        contentType = "css";
      }
      if (trimmedAssetName.indexOf(".png") > -1) {
        contentType = "png";
      }
      if (trimmedAssetName.indexOf(".jpg") > -1) {
        contentType = "jpg";
      }
      if (trimmedAssetName.indexOf(".ico") > -1) {
        contentType = "favicon";
      }
      callback(200, data, contentType);
    } catch (e) {
      console.log(e);
      callback(404);
    }
  }
};

/*
 * JSON API Handlers
 */

//Ping handler
handlers.ping = (data, callback) => {
  callback(200);
};

//Users
handlers.users = (data, callback) => {
  var acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.includes(data.method)) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }
};
//Container for the user submethods
handlers._users = {};

//Users - post
handlers._users.post = async (data, callback) => {
  var firstName =
    typeof data.payload.firstName === "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;

  var lastName =
    typeof data.payload.lastName === "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;

  var phone =
    typeof data.payload.phone === "string" &&
    data.payload.phone.trim().length == 10
      ? data.payload.phone.trim()
      : false;

  var password =
    typeof data.payload.password === "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;

  var tosAgreement = data.payload.tosAgreement === true;
  if (firstName && lastName && phone && password && tosAgreement) {
    try {
      await _data.read("users", phone);
      callback(400, { Error: "User already exists" });
    } catch (e) {
      //Hash the passoword
      var hashedPassword = helpers.hash(password);

      // Crate the user object
      var userObject = {
        firstName,
        lastName,
        phone,
        hashedPassword,
        tosAgreement,
      };

      //Store the user
      try {
        if (!hashedPassword) {
          throw Error;
        }
        await _data.create("users", phone, userObject);
        callback(200);
      } catch (e) {
        console.log(e);
        callback(500, { Error: "Could not create the new user" });
      }
    }
  } else {
    callback(400, { Error: "Missing required fields" });
  }
};
//Users - get
handlers._users.get = async (data, callback) => {
  //Check that the phone no. provided is valid
  var phone = data.queryStringObject.phone;
  phone =
    typeof phone === "string" && phone.trim().length === 10 ? phone : false;
  if (phone) {
    try {
      //Get the token from the header
      var token =
        typeof data.headers.token === "string" ? data.headers.token : false;
      var res = await handlers._tokens.verifyToken(token, phone);
      if (!res) {
        callback(403, { Error: "Missing required token or invalid token" });
      }
      //Lookup the user
      var user = await _data.read("users", phone);
      delete user.hashedPassword;
      callback(200, user);
    } catch (e) {
      callback(404);
    }
  } else {
    callback(400, { Error: "Missing required field" });
  }
};
//Users - put
handlers._users.put = async (data, callback) => {
  var phone = data.payload.phone;
  phone =
    typeof phone === "string" && phone.trim().length === 10 ? phone : false;
  var firstName =
    typeof data.payload.firstName === "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;

  var lastName =
    typeof data.payload.lastName === "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;

  var password =
    typeof data.payload.password === "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;

  if (phone) {
    var token =
      typeof data.headers.token === "string" ? data.headers.token : false;
    await handlers._tokens.verifyToken(token, phone);
    if (firstName || lastName || password) {
      try {
        const user = await _data.read("users", phone);
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        if (password) {
          user.hashedPassword = helpers.hash(password);
        }
        try {
          await _data.update("users", phone, user);
          callback(200);
        } catch (e) {
          console.log(e);
          callback(500, { Error: "Could not update the user" });
        }
      } catch (e) {
        callback(400, { Error: "the specified user does not exist" });
      }
    } else {
      callback(404, { Error: "Missing fields to update" });
    }
  } else {
    callback(400, { Error: "Missing required field" });
  }
};
//Users - delete
handlers._users.delete = async (data, callback) => {
  var phone = data.queryStringObject.phone;
  phone =
    typeof phone === "string" && phone.trim().length === 10 ? phone : false;
  if (phone) {
    try {
      var token =
        typeof data.headers.token === "string" ? data.headers.token : false;
      await handlers._tokens.verifyToken(token, phone);
      var user = await _data.read("users", phone);
      try {
        try {
          await _data.delete("users", phone);
        } catch (e) {
          callback(500, { Error: "User is Deleted checks are not deleted" });
        }

        var userChecks = user.checks;
        if (userChecks && userChecks.length) {
          var promises = userChecks.map(
            async (userCheck) => await _data.delete("checks", userCheck)
          );
          await Promise.all(promises);
        }
        callback(200);
      } catch (e) {
        console.log(e);
        callback(500, { Error: "Could not delete the user" });
      }
    } catch (e) {
      callback(403);
    }
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

//Tokens
handlers.tokens = (data, callback) => {
  var acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.includes(data.method)) {
    handlers._tokens[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for all the tokens methods
handlers._tokens = {};

//Token - post
handlers._tokens.post = async (data, callback) => {
  performance.mark("entered function");
  var phone =
    typeof data.payload.phone === "string" &&
    data.payload.phone.trim().length == 10
      ? data.payload.phone.trim()
      : false;

  var password =
    typeof data.payload.password === "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;
  performance.mark("input validated");
  if (phone && password) {
    //Look the user who matches that phone number
    try {
      performance.mark("begining user lookup");
      const user = await _data.read("users", phone);
      performance.mark("user lookup complete");
      performance.mark("begining password hashing");
      var hashedPassword = helpers.hash(password);
      performance.mark("password hashing complete");
      if (hashedPassword !== user.hashedPassword) {
        throw Error();
      }
      //Create a new token with a random name.Set expiration date 1 hour
      performance.mark("creating data for token");
      var tokenId = helpers.createRandomString(20);
      var expires = Date.now() + 100 * 60 * 60;
      var tokenObject = {
        phone,
        id: tokenId,
        expires,
      };
      performance.mark("begining storing token");
      try {
        await _data.create("tokens", tokenId, tokenObject);
        performance.mark("storing token complete");

        //Gather all the performance
        performance.measure(
          "Begining to end",
          "entered function",
          "storing token complete"
        );
        performance.measure(
          "Validating user input",
          "entered function",
          "input validated"
        );
        performance.measure(
          "User lookup",
          "begining user lookup",
          "user lookup complete"
        );
        performance.measure(
          "Password hashing",
          "begining password hashing",
          "password hashing complete"
        );
        performance.measure(
          "Token data creation",
          "creating data for token",
          "begining storing token"
        );
        performance.measure(
          "Token storing",
          "begining storing token",
          "storing token complete"
        );
        //Log out all the measurements
        const measurements = [];
        const obs = new PerformanceObserver((list) => {
          measurements.push(...list.getEntries());
        });
        obs.disconnect();
        obs.observe({ entryTypes: ["measure"] });

        measurements.forEach((measurement) => {
          debug(
            "\x1b[33m%s\x1b[0m",
            measurement.name + " " + measurement.duration
          );
        });
        callback(200, tokenObject);
      } catch (e) {
        console.log(e);
        callback(500, { Error: "Could not create token" });
      }
    } catch (e) {
      callback(400, { Error: "Invalid phone or password" });
    }
  } else {
    callback(400, { Error: "Missing required field(s)" });
  }
};

//Token - get
handlers._tokens.get = async (data, callback) => {
  var id = data.queryStringObject.id;
  id = typeof id === "string" && id.trim().length === 20 ? id : false;
  if (id) {
    //Lookup the user
    try {
      var token = await _data.read("tokens", id);
      callback(200, token);
    } catch (e) {
      callback(404);
    }
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

//Token - put
//only extending token time allowed
handlers._tokens.put = async (data, callback) => {
  var id = data.payload.id;
  id = typeof id === "string" && id.trim().length === 20 ? id : false;
  var extend = data.payload.extend === true;
  try {
    if (!id || !extend) throw Error();

    var token = await _data.read("tokens", id);
    if (token.expires <= Date.now()) throw Error();

    token.expires = Date.now() + 1000 * 60 * 60;
    try {
      await _data.update("tokens", id, token);
      callback(200);
    } catch (e) {
      callback(500, { Error: "Could not update token" });
    }
  } catch (e) {
    callback(400, {
      Error: "Missing require field(s) or field(s) are invalid",
    });
  }
};

//Token - delete
handlers._tokens.delete = async (data, callback) => {
  var id = data.queryStringObject.id;
  id = typeof id === "string" && id.trim().length === 20 ? id : false;
  if (id) {
    try {
      await _data.read("tokens", id);
      try {
        await _data.delete("tokens", id);
        callback(200);
      } catch (e) {
        console.log(e);
        callback(500, { Error: "Could not delete the token" });
      }
    } catch (e) {
      callback(400, { Error: "the specified token does not exist" });
    }
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

//Verify if a given token is currently valid for the given user
handlers._tokens.verifyToken = async (id, phone) => {
  return new Promise(async (resolve, reject) => {
    try {
      var token = await _data.read("tokens", id);
      if (token.phone === phone && token.expires > Date.now()) {
        resolve(token);
      } else {
        throw Error;
      }
    } catch (e) {
      reject();
    }
  });
};

//Checks
handlers.checks = (data, callback) => {
  var acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.includes(data.method)) {
    handlers._checks[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for all the Checks methods
handlers._checks = {};

//Checks - post
handlers._checks.post = async (data, callback) => {
  var protocol = data.payload.protocol;
  protocol =
    typeof protocol === "string" &&
    ["https", "http"].includes(protocol.toLowerCase())
      ? protocol
      : false;

  var url = data.payload.url;
  url = typeof url === "string" && url.trim().length > 0 ? url : false;

  var method = data.payload.method;
  method =
    typeof method === "string" &&
    ["get", "put", "post", "delete"].includes(method.toLowerCase())
      ? method
      : false;

  var successCodes = data.payload.successCodes;
  successCodes =
    Array.isArray(successCodes) && successCodes.length > 0
      ? successCodes
      : false;

  var timeoutSeconds = data.payload.timeoutSeconds;
  timeoutSeconds =
    typeof timeoutSeconds === "number" &&
    timeoutSeconds % 1 === 0 &&
    timeoutSeconds >= 1 &&
    timeoutSeconds <= 5
      ? timeoutSeconds
      : false;

  if (protocol && url && successCodes && timeoutSeconds) {
    try {
      var token =
        typeof data.headers.token === "string" ? data.headers.token : false;

      token = await _data.read("tokens", token);
      var user = await _data.read("users", token.phone);
      var userChecks =
        (typeof user.checks === "object") & (user.checks instanceof Array)
          ? user.checks
          : [];

      if (userChecks.length < config.maxChecks) {
        //Verify that the URL given has DNS entries (and therefore can resolve)
        var parsedUrl = _url.parse(protocol + "://" + url, true);
        var hostName =
          typeof parsedUrl.hostname === "string" &&
          parsedUrl.hostname.length > 0
            ? parsedUrl.hostname
            : false;
        try {
          var records = await resolver.resolve(hostName);
          if (!records && !records.length) {
            throw Error;
          }
        } catch (e) {
          callback(400, {
            Error:
              "The hostname of the URL entered did not resolve to any DNS entries",
          });
          return;
        }

        //Create random id for the checks
        var checkId = helpers.createRandomString(20);

        //Create the check object,and include user's phone

        var checkObject = {
          id: checkId,
          userPhone: token.phone,
          protocol,
          url,
          method,
          successCodes,
          timeoutSeconds,
        };
        try {
          //Save the Object
          await _data.create("checks", checkId, checkObject);
          user.checks = [...userChecks];
          user.checks.push(checkId);

          //Save new user data
          await _data.update("users", user.phone, user);
          callback(200, checkObject);
        } catch (e) {
          callback(500, { Error: "Could not create the new check" });
        }
      } else {
        callback(400, {
          Error: `The user already has max number of checks ${config.maxChecks}`,
        });
      }
    } catch (e) {
      callback(403);
    }
  } else {
    callback(400, { Error: "Missing required inputs,or inputs are invalid" });
  }
};

//Checks - get
handlers._checks.get = async (data, callback) => {
  //Check that the id provided is valid
  var id = data.queryStringObject.id;
  id = typeof id === "string" && id.trim().length === 20 ? id : false;

  if (id) {
    try {
      //Look up the check
      var check = await _data.read("checks", id);

      //Get the token from the header
      var token =
        typeof data.headers.token === "string" ? data.headers.token : false;
      //Verify that the given token is valid and belongs to the user who created the check
      await handlers._tokens.verifyToken(token, check.userPhone);
      callback(200, check);
    } catch (e) {
      callback(403);
    }
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

//Checks - put
handlers._checks.put = async (data, callback) => {
  //var phone = data.payload.phone;
  var id = data.payload.id;
  typeof id === "string" && id.trim().length === 20 ? id : false;

  var protocol = data.payload.protocol;
  protocol =
    typeof protocol === "string" &&
    ["https", "http"].includes(protocol.toLowerCase())
      ? protocol
      : false;

  var url = data.payload.url;
  url = typeof url === "string" && url.trim().length > 0 ? url : false;

  var method = data.payload.method;
  method =
    typeof method === "string" &&
    ["get", "put", "post", "delete"].includes(method.toLowerCase())
      ? method
      : false;

  var successCodes = data.payload.successCodes;
  successCodes =
    Array.isArray(successCodes) && successCodes.length > 0
      ? successCodes
      : false;

  var timeoutSeconds = data.payload.timeoutSeconds;
  timeoutSeconds =
    typeof timeoutSeconds === "number" &&
    timeoutSeconds % 1 === 0 &&
    timeoutSeconds >= 1 &&
    timeoutSeconds <= 5
      ? timeoutSeconds
      : false;

  if (id && (protocol || url || method || successCodes || timeoutSeconds)) {
    //Looking the check
    try {
      var check = await _data.read("checks", id);

      //Get the token from the header
      var token =
        typeof data.headers.token === "string" ? data.headers.token : false;
      //Verify that the given token is valid and belongs to the user who created the check
      await handlers._tokens.verifyToken(token, check.userPhone);
      check.protocol = protocol || check.protocol;
      check.url = url || check.url;
      check.method = method || check.method;
      check.successCodes = successCodes || check.successCodes;
      check.timeoutSeconds = timeoutSeconds || check.timeoutSeconds;
      try {
        await _data.update("checks", id, check);
        callback(200);
      } catch (e) {
        callback(500, { Error: "Could not update the check" });
      }
    } catch (e) {
      callback(403);
    }
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

//Check - delete
handlers._checks.delete = async (data, callback) => {
  var id = data.queryStringObject.id;
  id = typeof id === "string" && id.trim().length === 20 ? id : false;
  if (id) {
    try {
      var check = await _data.read("checks", id);
      //Get the token from the header
      var token =
        typeof data.headers.token === "string" ? data.headers.token : false;

      //Verify that the given token is valid and belongs to the user who created the check
      await handlers._tokens.verifyToken(token, check.userPhone);
      try {
        var user = await _data.read("users", check.userPhone);
        user.checks.splice(user.checks.indexOf(id), 1);
        await _data.update("users", user.phone, user);
        await _data.delete("checks", id);
        callback(200);
      } catch (e) {
        callback(500, { Error: "Could not delete the check" });
      }
    } catch (e) {
      callback(403);
    }
  } else {
    callback(400, { Error: "Missing required field" });
  }
};
//No unhandler
handlers.notFound = (data, callback) => {
  callback(404);
};

//Export handlers
module.exports = handlers;
