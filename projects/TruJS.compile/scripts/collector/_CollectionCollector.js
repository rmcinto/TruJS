/**
* This factory creates a worker function that uses the entry's `files` property
* to first resolve all paths and then load the file data. The result is an
* object that has all the path information plus the file data.
*
* example:
*   {
*     "path": "/projects/myproject/file.js"
*     , "root": "/"
*     , "dir": "/projects/myproject"
*     , "file": "file.js"
*     , "name": "file"
*     , "ext": ".js"
*     , "data": "{data}"
*   }
*
* @factory
*/
function _CollectionCollector(promise, nodeFs, pathResolver, getScriptsDir, errors, fileObj) {

  /**
  * Resolves all relative paths in the entry's `files` array
  * @function
  */
  function resolvePaths(resolve, reject, base, entry) {
    pathResolver(base, entry.files)
      .then(function (paths) {
        resolve(paths);
      })
      .catch(function (err) {
        reject(err);
      });
  }
  /**
  * Loads the file data for each path
  * @function
  */
  function loadFileData(resolve, reject, paths) {
    var allData = [] //container for the results
    , hasErr //flag that indicates there was an error, and not to proceed
    , len = paths.length //counter to determine when all files are done
    ;

    //loop through all path objects
    paths.forEach(forEachPath);

    //iterator for each path object
    function forEachPath(pathObj, indx) {
      //ensure the files exists
      if (!pathObj.missing) {
        //read the file
        nodeFs.readFile(pathObj.path, 'utf8', function (err, data) {
          readFileCb(err, data, pathObj, indx);
        });
      }
      else {
        readFileCb(new Error(errors.fileMissing.replace("{path}", pathObj.path)), null, null, indx);
      }
    }

    //handler for the file read callback
    function readFileCb(err, data, pathObj, indx) {
      //stop if we've had an error
      if(hasErr) {
        return;
      }

      if (!!err) {
        //mark that we had an error and reject
        hasErr = true;
        reject(err);
      }
      else {
        //add the data to the object and update the array
        //fileObj.data = data;
        allData[indx] = fileObj(pathObj, data);

        len--;
        if (len === 0) {
          resolve(allData);
        }
      }
    }

  }

  /**
  * @worker
  * @function
  */
  return function CollectionCollector(base, entry) {
    //setup the path to the scripts, using the default or the manifest entry
    var scriptsPath = getScriptsDir(base, entry);

    //resolve the file paths for each member in the `files` array
    var proc =  new Promise(function (resolve, reject) {
      resolvePaths(resolve, reject, scriptsPath, entry);
    });

    //load the file data for each path
    proc = proc.then(function (paths) {
      if (paths.length > 0) {
        return new Promise(function (resolve, reject) {
          loadFileData(resolve, reject, paths);
        });
      }
      else {
        return promise.resolve([]);
      }
    });

    return proc;
  };
}
