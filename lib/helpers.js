/*
 * Helper for various tasks
 */
//Dependencies
var crypto = require("crypto");
var https = require("https");
var querystring = require("querystring");
var config = require("./config");
var path = require("path");
var fs = require("fs/promises");

//Container for helpers
var helpers = {};

// Create a SHA256 hash
helpers.hash = (str) => {
  if (typeof str === "string" && str.length > 0) {
    var hash = crypto
      .createHmac("sha256", config.hashingSecret)
      .update(str)
      .digest("hex");
    return hash;
  } else {
    return false;
  }
};

//Parse a JSON string to an object in all cases without throwing
helpers.parseJsonToObject = (str) => {
  try {
    var obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
};

helpers.createRandomString = (strLength) => {
  strLength =
    typeof strLength === "number" && strLength > 0 ? strLength : false;
  if (strLength) {
    //Define all the possible characters that could go into a string
    var possibleCharacters = "abcdefghijklmnopqrst0123456789";

    var str = "";
    for (i = 1; i <= strLength; i++) {
      var randomCharacter = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );
      str += randomCharacter;
    }
    return str;
  } else {
    return false;
  }
};

//Send an SMS message via Twilio
helpers.sendTwilioSms = (phone, msg, callback) => {
  phone =
    typeof phone === "string" && phone.trim().length === 10
      ? phone.trim()
      : false;
  msg =
    typeof msg === "string" &&
    msg.trim().length > 0 &&
    msg.trim().length <= 1600
      ? msg.trim()
      : false;

  if (phone && msg) {
    var payload = {
      from: config.twilio.fromPhone,
      to: "+91" + phone,
      body: msg,
    };
    console.log(payload);
    //Stringify the request payload
    var stringPayload = querystring.stringify(payload);

    //Configure the request details
    var requestDetails = {
      protocol: "https:",
      hostname: "api.twilio.com",
      method: "POST",
      path:
        "/2010-04-01/Accounts/" + config.twilio.accountSid + "/Messages.json",
      auth: config.twilio.accountSid + ":" + config.twilio.authToken,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(stringPayload),
      },
    };

    //Instantiate teh request object
    var req = https.request(requestDetails, (res) => {
      var status = res.statusCode;
      //Callback successfully if the request went through
      console.log(res.statusMessage);
      if (status === 200 || status === 201) {
        callback(false);
      } else {
        console.log(res.statusMessage);
        callback("Status code returned was " + status);
      }
    });
    //Bind the error event so it doesn't get thrown (Crash the application)
    req.on("error", (e) => {
      callback(e);
    });
    //Add the payload
    req.write(stringPayload);

    //send the request
    req.end();
  } else {
    callback("Given parameters were missing or invalid");
  }
};

//Get the string content of a template
helpers.getTemplate = async (templateName, data) => {
  return new Promise(async (resolve, reject) => {
    templateName =
      typeof templateName === "string" && templateName.length > 0
        ? templateName
        : false;
    data = typeof data === "object" && data != null ? data : {};

    if (templateName) {
      var templateDir = path.join(__dirname, "/../templates/");
      try {
        var str = await fs.readFile(
          templateDir + templateName + ".html",
          "utf-8"
        );
        var finalStr = helpers.interpolate(str, data);
        resolve(finalStr);
      } catch (e) {
        reject("No template could be found");
      }
    } else {
      reject("A valid name was not specified");
    }
  });
};

//Add the universal header and footer and pass provided data object to the header and footer
helpers.addUniversalTemplates = async (str, data, callback) => {
  str = typeof str === "string" && str.length > 0 ? str : "";
  data = typeof data === "object" && data != null ? data : {};

  //wrapper
  try {
    var wrapperString = await helpers.getTemplate("_wrapper", data);
    var find = "{page.content}";
    wrapperString = wrapperString.replace(find, str);
    callback(false, wrapperString);
  } catch (e) {
    callback("Could not find the header template");
  }
};

//Take a given string and a data object and find/replace all the keys within it
helpers.interpolate = (str, data) => {
  str = typeof str === "string" && str.length > 0 ? str : "";
  data = typeof data === "object" && data != null ? data : {};

  //Add the templateGlobals to the data object,prepending their key name with "global"
  for (var keyName in config.templateGlobals) {
    if (config.templateGlobals.hasOwnProperty(keyName)) {
      data["global." + keyName] = config.templateGlobals[keyName];
    }
  }

  //For each key in the data object, insert its value into the string at the correspoding placeholder
  for (var key in data) {
    if (data.hasOwnProperty(key) && typeof data[key] === "string") {
      var replace = data[key];
      var find = "{" + key + "}"; //{global.property}
      str = str.replace(find, replace);
    }
  }
  return str;
};

//Get the contents of a static (public) asset
helpers.getStaticAsset = async (fileName) => {
  return new Promise(async (resolve, reject) => {
    fileName =
      typeof fileName === "string" && fileName.length > 0 ? fileName : false;
    try {
      var publicDir = path.join(__dirname + "/../public/");
      var data = await fs.readFile(publicDir + fileName);
      resolve(data);
    } catch (e) {
      reject("A valid file name was not specified");
    }
  });
};

module.exports = helpers;
