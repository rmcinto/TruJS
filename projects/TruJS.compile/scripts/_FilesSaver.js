/**
*
* @factory
* @function
*/
function _FilesSaver(nodeFs, nodePath, promise) {
  var cnsts = {
    "exists": -4075
  };

  /**
  * Loops through all the files and saves each
  * @function
  */
  function saveFiles(resolve, reject, filePath, files) {
    var len = files.length, hasErr;

    files.forEach(function forEachFile(fileObj) {
      saveFile(filePath, fileObj, writeCallback);
    });

    function writeCallback(err) {
        if(!!err) {
          hasErr = true;
          reject(err);
        }
        else if (!hasErr) {
          len--;
          if (len === 0) {
            resolve();
          }
        }
    }

  }
  /**
  * Scrapes the file annotation, determines the path, and saves the file
  * @function
  */
  function saveFile(filePath, fileObj, cb) {
    //create the fully qualified path
    filePath = createFilePath(filePath, fileObj);

    //create the directory structure if needed
    ensureDirectory(filePath, function(err) {
      if (!!err) {
        cb(err);
      }
      else {
        //save the file
        nodeFs.writeFile(filePath, fileObj.data, cb);
      }
    });

  }
  /**
  * Uses the file fragment to modify the path and adds a file name if one is
  * missing
  * @function
  */
  function createFilePath(filePath, fileObj) {
    //see if there was a fragment
    var fragment = fileObj.fragment;

    //if there is a fragment, add it to the end of the path
    if (!!fragment) {
      filePath = nodePath.join(filePath, fragment);
    }

    //if there isn't a file name then add it
    if (!nodePath.extname(filePath)) {
      if (!!fileObj.file) {
        filePath = nodePath.join(filePath, fileObj.file);
      }
    }

    return nodePath.resolve(filePath);
  }
  /**
  * Ensures the directory structure exists
   @function
  */
  function ensureDirectory(filePath, cb) {
    var pathObj = nodePath.parse(filePath);

    nodeFs.mkdir(pathObj.dir, function(err) {
      //if there was an error, it could be that the directory exists, ignore those
      if (!!err) {
        if (err.errno !== cnsts.exists) {
          cb(err);
          return;
        }
      }
      //all good, fire the callback
      cb();
    });
  }
  /**
  *
  * @worker
  * @function
  */
  return function FileSaver(filePath, files) {

    return new promise(function (resolve, reject) {
      saveFiles(resolve, reject, filePath, files);
    });

  };
}
