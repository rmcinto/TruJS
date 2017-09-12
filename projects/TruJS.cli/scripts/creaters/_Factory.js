/**
* This factory creates a worker function that creates a new factory file.
*   fnName: {the name of the function}
*   file: {the relative file path}
* @factory
*/
function _Factory(promise, getBase, pathParser, nodePath, errors) {
  var cnsts = {
    "factoryFile": [
      "function _{fnName}() {"
      , ""
      , "\t/**"
      , "\t* @worker"
      , "\t*/"
      , "\tfunction {fnName}() {"
      , "\t\t"
      , "\t};"
      , "}"
    ]
  };

  /**
  * Gets the base path using the cmdArgs object, looking for either a project or
  * repo name
  * @function
  */
  function getBasePath(resolve, reject, cmdArgs) {
    //test for project or repo name
    if (!!cmdArgs.project && cmdArgs.repo) {
      reject(new Error(errors.missingProjectRepo));
      return;
    }
    try {
      //the base path will be either a project or repo
      var basePath = getBase(cmdArgs)
      //update special tags and create the path object
      , basePathObj = pathParser(basePath)
      ;

      resolve(basePathObj);
    }
    catch(ex) {
      reject(ex);
    }
  }
  /**
  * Gets an array of assets and resolves the promise
  * @function
  */
  function getAssets(resolve, reject, basePathObj, config) {
    if (!config.fnName) {
      reject(new Error(errors.missingFnNameOption));
    }
    if (!config.file) {
      reject(new Error(errors.missingFileOption));
    }
    try {
      var factoryFile = {
        "path": createFactoryPath(basePathObj, config)
        , "data": createFactoryFileData(config)
      };

      resolve([factoryFile]);
    }
    catch(ex) {
      reject(ex);
    }
  }
  /**
  *
  * @function
  */
  function createFactoryPath(basePathObj, config) {
    var path = nodePath.join(basePathObj.path, config.file);

    if (nodePath.extname(path) === "") {
      path = nodePath.join(path, "_" + config.fnName + ".js");
    }

    return path;
  }
  /**
  * Creates the factory file data
  * @function
  */
  function createFactoryFileData(config) {
    var data = cnsts.factoryFile.join("\n");

    data = data.replace("{fnName}", config.fnName);

    return data;
  }

  /**
  * @worker
  */
  return function Factory(cmdArgs) {

    var proc = new promise(function(resolve, reject) {
      getBasePath(resolve, reject, cmdArgs);
    });

    return proc.then(function (basePathObj) {
      return new promise(function (resolve, reject) {
        getAssets(resolve, reject, basePathObj, cmdArgs.create);
      });
    });

  };
}
