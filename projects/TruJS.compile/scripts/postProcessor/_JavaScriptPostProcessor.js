/**
* This factory produces a worker function that runs post process routines
*  against the file array. If the `minify` option is !false then the files will
* be minified. If the `lint` option is true or "post" then the files will be
* linted.
* @factory
*/
function _JavaScriptPostProcessor(promise, linter, minifier) {

  /**
  * Loops through each file and runs the post process for each
  * @function
  */
  function processFiles(resolve, reject, entry, files) {
    var procs = [];

    files.forEach(function forEachFile(fileObj) {
      procs.push(processFile(entry, fileObj));
    });

    //wait for all files to process and then resolve with the updated files
    promise.all(procs)
      .then(function (files) {
        resolve(files);
      })
      .catch(function (err) {
        reject(err);
      });

  }
  /**
  * Runs the minifier and linter for the file
  * @function
  */
  function processFile(entry, fileObj) {
    var proc = promise.resolve(fileObj);

    if (entry.minify !== false) {
      proc = proc.then(function (fileObj) {
        return minifier(fileObj);
      });
    }

    if (entry.lint === true || entry.lint === "post") {
      proc = proc.then(function (fileObj) {
        //run the linter, then add the results, then return the fileObj
        return linter(fileObj.data)
          .then(function (results) {
            //add the results to the fileObj
            fileObj["lint"] = results;

            return fileObj;
          });
      });
    }

    return proc;
  }

  /**
  * @worker
  */
  return function JavaScriptPostProcessor(entry, files) {

    return new promise(function(resolve, reject) {
      processFiles(resolve, reject, entry, files);
    });

  };
}
