/**
* This factory creates a worker function that generates a new project directory
* and common assests, including the scripts folder and manifest file
* create parameters:
*   manifest: {comma delimited list of types}
*   module: {optional root object}
* @factory
*/
function _Project(promise, getBase, pathParser, nodePath, errors) {
  var cnsts = {
    "readme": "README.md"
    , "manifest": "manifest.json"
    , "manifestEntry": "{\n\t\"type\": \"{type}\",\n\t\"name\": \"{name}\"\n}"
    , "module": "module.json"
    , "scriptsDir": "scripts"
    , "startPath": "{projects}"
  };

  /**
  * Derives the base path from the create object
  * @function
  */
  function getBasePath(resolve, reject, config) {
    //we should have a value at config.project
    if (!config.project) {
      reject(new Error(errors.missingCreateProjectName));
      return;
    }
    try {
      //create the base path
      var basePath = nodePath.join(cnsts.startPath, config.project)
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
    , name = config.project
    ;

    //project directory
    assets.push({
      "path": basePathObj.path
      , "isDirectory": true
    });

    //scripts directory
    assets.push({
      "path": nodePath.join(basePathObj.path, cnsts.scriptsDir)
      , "isDirectory": true
    });

    //readme file
    assets.push({
      "path": nodePath.join(basePathObj.path, cnsts.readme)
      , "data": ""
    });

    //manifest file
    assets.push({
      "path": nodePath.join(basePathObj.path, cnsts.manifest)
      , "data": createManifest(name, config.manifest)
    });

    // module file, if there is a module option
    if (config.module !== undefined) {
      assets.push({
        "path": nodePath.join(basePathObj.path, cnsts.module)
        , "data": createModule(config.module)
      });
    }

    return assets;
  }
  /**
  * Builds the manifest file entries based on the config.manifest property
  * @function
  */
  function createManifest(name, manifest) {
    //if there isn't a manifest entry then the default is a single module entry
    if (!manifest) {
      manifest = "module";
    }
    //the manifest entry is comma delimited
    var entries = manifest.split(",")
    , data = [];
    entries.forEach(function forEachEntry(entry) {
      data.push(
        cnsts.manifestEntry
          .replace("{type}", entry)
          .replace("{name}", name)
      );
    });

    return data.join(",\n");
  }
  /**
  * Builds the module file based on the config.module property
  * @function
  */
  function createModule(module) {
    var data = "{";

    //if there is a module value that is the root
    if (!!module) {
      data += "\n\t\"root\": [{ \"" + module + "\": [\":" + module + "\"]}]"
    }

    data += "\n}";

    return data;
  }

  /**
  * @worker
  */
  return function Project(cmdArgs) {

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
