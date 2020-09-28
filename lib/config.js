/*
 *Create and export configuration variable
 */

//Container for all the environments
var environments = {};

// Staging (default) environment
environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: "staging",
  hashingSecret: "aa262#jskda812",
  maxChecks: 5,
  twilio: {
    accountSid: "AC50244e93746b8db4071d9a130286b2c1",
    authToken: "b655eb46422f8736dcf23c820b610d36",
    fromPhone: "+918178845614",
  },
  templateGlobals: {
    appName: "UptimeChecker",
    companyName: "NotARealCompany, Inc",
    yearCreated: "2020",
    baseUrl: "http://localhost:3000",
  },
};

//Production environment
environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: "production",
  hashingSecret: "aa262#jskda812",
  maxChecks: 5,
  twilio: {
    accountSid: "",
    authToken: "",
    fromPhone: "",
  },
  templateGlobals: {
    appName: "UptimeChecker",
    companyName: "NotARealCompany, Inc",
    yearCreated: "2020",
    baseUrl: "", // production URL
  },
};
//Determine which environment was passed as a command line argument
var currentEnvironment =
  typeof process.env.NODE_ENV === "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

//Check that current environment is one of the environments above,if not, default to staging
var environmentToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;

//Export the module
module.exports = environmentToExport;
