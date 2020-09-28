/**
 * library for storing and rotating logs
 */

//Dependencies
var fs = require("fs/promises");
var path = require("path");
var zlib = require("zlib");
const { promisify } = require("util");
var gzip = promisify(zlib.gzip);
var unzip = promisify(zlib.unzip);
//Container for the module
var lib = {};

// base directory of the logs folder
lib.baseDir = path.join(__dirname, "/../.logs/");

//Append a string to a file. Create the file if it does not exists.
lib.append = async (file, str) => {
  return new Promise(async (resolve, reject) => {
    //Open the file for appending
    try {
      await fs.appendFile(lib.baseDir + file + ".log", str + "\n");
      resolve();
    } catch (e) {
      console.log(e);
      console.log("Could not append");
      reject(e);
    }
  });
};

//List all the logs and optionally include the compressed logs
lib.list = async (includeCompressedLogs) => {
  return new Promise(async (resolve, reject) => {
    try {
      var data = await fs.readdir(lib.baseDir);
      var trimmedFileNames = [];
      var promises = data.map(async (fileName) => {
        if (fileName.indexOf(".log") > -1) {
          trimmedFileNames.push(fileName.replace(".log", ""));
        }
        //Add on the .gz files
        if (fileName.indexOf(".gz.b64") > -1 && includeCompressedLogs) {
          trimmedFileNames.push(fileName.replace(".gz.b64"), "");
        }
        resolve(trimmedFileNames);
      });
      await Promise.all(promises);
    } catch (e) {
      reject(e);
    }
  });
};

//Compress the contents of the .log file into a .giz.b64 file within the same directory
lib.compress = async (logId, newFileId) => {
  return new Promise(async (resolve, reject) => {
    var sourceFile = logId + ".log";
    var destFile = newFileId + ".gz.b64";

    try {
      var inputString = await fs.readFile(lib.baseDir + sourceFile, "utf-8");

      //Compress data using zlib library
      var buffer = await gzip(inputString);

      //Send the compressed data to destination file

      var fileDescriptor = await fs.open(lib.baseDir + destFile, "wx");
      await fs.writeFile(fileDescriptor, buffer.toString("base64"));
      await fileDescriptor.close();
      resolve(true);
    } catch (e) {
      console.log(e);
      reject();
    }
  });
};

//Decompress the content of a .gz.b64 file into a string variable
lib.decompress = async (fileId) => {
  return new Promise(async (resolve, reject) => {
    try {
      var fileName = fileId + ".gz.b64";
      var str = await fs.readFile(lib.baseDir + fileName, "utf-8");
      //Decompress the data
      var inputBuffer = Buffer.from(str, "base64");
      var outputBuffer = await unzip(inputBuffer);
      var data = outputBuffer.toString();
      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
};

//Truncate a log file
lib.truncate = async (logId) => {
  return new Promise(async (resolve, reject) => {
    try {
      await fs.truncate(lib.baseDir + logId + ".log", 0);
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = lib;
