/*
 * Library for storing and editing data
 */

// Dependencies
var fs = require("fs/promises");
const { resolve } = require("path");
var path = require("path");
var helpers = require("./helpers");

//Conatiner for module which will be exported
var lib = {};

// base directory of the data folder
lib.baseDir = path.join(__dirname, "/../.data/");

//Writing file promise version
lib.create = (dir, file, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const fileDescriptor = await fs.open(
        lib.baseDir + dir + "/" + file + ".json",
        "wx"
      );
      var stringData = JSON.stringify(data);

      //Write to the new file
      await fs.writeFile(fileDescriptor, stringData);
      await fileDescriptor.close();
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

lib.read = (dir, file) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fs.readFile(
        lib.baseDir + dir + "/" + file + ".json",
        "utf8"
      );
      resolve(helpers.parseJsonToObject(res));
    } catch (e) {
      reject(e);
    }
  });
};

lib.update = (dir, file, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const fileDescriptor = await fs.open(
        lib.baseDir + dir + "/" + file + ".json",
        "r+"
      );
      var stringData = JSON.stringify(data);
      await fileDescriptor.truncate();
      await fs.writeFile(fileDescriptor, stringData);
      await fileDescriptor.close();
      resolve();
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

//Delete a file
lib.delete = (dir, file) => {
  return new Promise(async (resolve, reject) => {
    try {
      await fs.unlink(lib.baseDir + dir + "/" + file + ".json");
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

//List all the items in a directory
lib.list = async (dir) => {
  return new Promise(async (resolve, reject) => {
    try {
      var data = await fs.readdir(lib.baseDir + dir + "/");
      var trimmedFileNames = [];
      data.forEach((fileName) => {
        trimmedFileNames.push(fileName.replace(".json", ""));
      });
      resolve(trimmedFileNames);
    } catch (e) {
      reject(e);
    }
  });
};

// //Write data to a file
// lib.create = function (dir, file, data, callback) {
//   //Open/Create the file for writing
//   fs.open(
//     lib.baseDir + dir + "/" + file + ".json",
//     "wx",
//     (err, fileDescriptor) => {
//       if (!err && fileDescriptor) {
//         var stringData = JSON.stringify(data);

//         //Write to the new file
//         fs.writeFile(fileDescriptor, stringData, (err) => {
//           if (!err) {
//             fs.close(fileDescriptor, (err) => {
//               if (!err) {
//                 callback(false);
//               } else {
//                 callback("Error closing the file");
//               }
//             });
//           } else {
//             callback("Error writing to new file");
//           }
//         });
//       } else {
//         callback("Could not create new file,it may already exists");
//       }
//     }
//   );
// };

//Read data from a file
// lib.read = (dir, file, callback) => {
//   fs.readFile(lib.baseDir + dir + "/" + file + ".json", "utf8", (err, data) => {
//     callback(err, data);
//   });
// };

//Update data inside a file
// lib.update = (dir, file, data, callback) => {
//   //Open the file for writing
//   fs.open(
//     lib.baseDir + dir + "/" + file + ".json",
//     "r+",
//     (err, fileDescriptor) => {
//       if (!err && fileDescriptor) {
//         var stringData = JSON.stringify(data);
//         fs.ftruncate(fileDescriptor, (err) => {
//           if (!err) {
//             fs.writeFile(fileDescriptor, stringData, (err) => {
//               if (!err) {
//                 fs.close(fileDescriptor, (err) => {
//                   if (!err) {
//                     callback(false);
//                   } else {
//                     callback("there was an error closing the file");
//                   }
//                 });
//               } else {
//                 callback("Error writing to existing file");
//               }
//             });
//           }
//         });
//       } else {
//         callback("Could not open the file for updating it may not exist");
//       }
//     }
//   );
// };

// lib.delete = (dir, file, callback) => {
//   // Unlink(deleting file from filesystem)
//   fs.unlink(lib.baseDir + dir + "/" + file + ".json", (err) => {
//     if (!err) {
//       callback(false);
//     } else {
//       callback("Error deleting the file");
//     }
//   });
// };
module.exports = lib;
