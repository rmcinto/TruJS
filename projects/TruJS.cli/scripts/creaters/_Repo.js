/**
* This factory creates a worker function that generates a new repo directory
* with a README.md file
* @factory
*/
function _Repo(promise, nodePath, pathParser, errors) {
  var cnsts = {
    "readme": "README.md"
    , "startPath": "{repos}"
  };

  /**
  * Derives the base path from the create object
  * @function
  */
  function getBasePath(resolve, reject, config) {
    //we should have a value at config.project
    if (!config.repo) {
      reject(new Error(errors.missingCreateRepoName));
      return;
    }
    try {
      //create the base path
      var basePath = nodePath.join(cnsts.startPath, config.repo)
      //resolve special tags and get the pathObj
      , basePathObj = pathParser(basePath)
      ;
      //resolve the base path object
      resolve(basePathObj);
    }
    catch(ex) {
      reject(ex);
    }
  }
  /**
  * Gets the list of assets and resolves the promise
  * @function
  */
  function getAssets(resolve, reject, basePathObj, config) {
    try {
      //create an array of asset objects
      var assets = createAssetList(basePathObj, config);
      resolve(assets);
    }
    catch(ex) {
      reject(ex);
    }
  }
  /**
  * Creates a list of file/directory assests
  * @function
  */
  function createAssetList(basePathObj, config) {
    var assets = []
    , name = config.repo;

    //project directory
    assets.push({
      "path": basePathObj.path
      , "isDirectory": true
    });

    //readme file
    assets.push({
      "path": nodePath.join(basePathObj.path, cnsts.readme)
      , "data": ""
    });

    return assets;
  }
  /**
  * @worker
  */
  return function Repo(cmdArgs) {

    var proc = new promise(function (resolve, reject) {
      getBasePath(resolve, reject, cmdArgs.create);
    });

    return proc.then(function (basePathObj) {
      return new promise(function (resolve, reject) {
        getAssets(resolve, reject, basePathObj, cmdArgs.create);
      });
    });

  };
}
