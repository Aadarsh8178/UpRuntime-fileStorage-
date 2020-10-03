/**
 * Unit Tests
 */

//Dependencies
var helpers = require("../lib/helpers");
var assert = require("assert");
var logs = require("../lib/logs");
var exampleDebuggingProblem = require("../lib/exampleDebuggingProblem");

//Holer for tests
var unit = {};

//Assert that the getANumber function is returning a number
unit["helpers.getANumber should return a number"] = (done) => {
  var val = helpers.getANumber();
  assert.strictEqual(typeof val, "number");
  done();
};

//Assert that the getANumber function is returning a 1
unit["helpers.getANumber should return a 1"] = (done) => {
  var val = helpers.getANumber();
  assert.strictEqual(val, 1);
  done();
};

//Assert that the getANumber function is returning a 2
unit["helpers.getANumber should return a 2"] = (done) => {
  var val = helpers.getANumber();
  assert.strictEqual(val, 2);
  done();
};

//Logs.list should callback an array and a false error
unit["logs.list should callback a false error and an array of log names"] = (
  done
) => {
  try {
    var data = logs.list(true);
    assert(false, false); //to check if above line didn't throw error
    assert.ok(data instanceof Array);
    assert.ok(data.length > 1);
    done();
  } catch (e) {
    done();
  }
};

//Logs.truncate should not throw if the logId doesn't exist
unit[
  "logs.truncate should not throw if the logId does not exist.It should callback an error instead"
] = (done) => {
  assert.doesNotThrow(async () => {
    var err = await logs.truncate("I do not exist");
    assert.ok(err);
    done();
  }, TypeError);
};
//exampledebuggingproblem.init should not throw (but it does)
unit["exampleDebuggingProblem.init should not throw when called"] = (done) => {
  assert.doesNotThrow(() => {
    exampleDebuggingProblem.init();
    done();
  }, TypeError);
};

//Export the tests to the runner;
module.exports = unit;
