/**
 * Library that demonstrate something throwing when it's init is called
 */

var example = {};

//Init function
example.init = () => {
  var foo = bar; //This is an error created intentionally (bar is not defined)
};

//Export the module
module.exports = example;
