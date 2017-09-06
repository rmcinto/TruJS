/**
* This factory produces a worker function that uses the module.json file to
* create the list of required files
* @factory
*/
function _ModuleCollector(promise, collector_collection, defaults, pathParser, getScriptsDir, moduleFileLoader, moduleFileProcessor, modulePathProcessor, nodePath) {
  var cnsts = {
    "module": "module.json"
  };

  /**
  * Using the manifest entry and base path, produces an array of paths for each
  * based on the module and baseModule properties in the entry
  * @function
  */
  function getModulePaths(base, entry) {
    var baseModule = entry.baseModule, modulePaths = []
    , curModule = pathParser(base, entry.moduleFile || cnsts.module);

    //if there is a baseModule entry, add that to the modulePaths
    if (!!baseModule) {
      if (!isArray(baseModule)) {
        baseModule = [baseModule];
      }
      //resolve all paths
      baseModule.forEach(function forEachBaseModule(path) {
        if (nodePath.extname(path) === "") {
          path = nodePath.join(path, cnsts.module);
        }
        path = pathParser(null, path);
        modulePaths.push(path);
      });
    }

    //add the current entry's module path at the end
    modulePaths.push(curModule);

    return modulePaths;
  }
  /**
  * Loads all module files in the module array
  * @function
  */
  function loadModules(paths) {
    var procs = [];

    paths.forEach(function forEachPath(pathObj) {
      procs.push(moduleFileLoader(pathObj.path));
    });

    return promise.all(procs);
  }
  /**
  * Merge all of the loaded module objects
  * @function
  */
  function mergeModules(modules) {
    var module = {};
    modules.forEach(function forEachModule(modObj) {
      module = apply(modObj, module);
    });

    return module;
  }
  /**
  * Add the require ioc paths and add any files from the manifest entry
  * @function
  */
  function augmentPaths(entry, scriptsPath, paths) {
    //add the required ioc paths
    paths = addIocPaths(scriptsPath, paths);
    //add any paths in the entry's files property
    return addEntryFiles(scriptsPath, paths, entry.files);
  }
  /**
  * Add the required ioc entries from the defaults
  * @function
  */
  function addIocPaths(scriptsPath, paths) {
    //convert the iocPaths constants into real paths
    var allPaths = defaults.iocPaths.map(function mapIocPaths(path) {
      return pathParser(scriptsPath, path).path;
    });

    //only add the non-ioc paths from our compiled array of paths
    return allPaths
      .concat(paths.filter(function filterPaths(path) {
        if (allPaths.indexOf(path) === -1) {
          return true;
        }
      }));
  }
  /**
  * Adds any members from the entry's files array to the end of the paths array
  * @function
  */
  function addEntryFiles(scriptsPath, paths, files) {
    if(!!files) {
      files.forEach(function forEachEntryFile(path) {
        paths.push(pathParser(scriptsPath, path).path);
      });
    }
    return paths;
  }

  /**
  * @worker
  */
  return function ModuleCollector(base, entry) {
    //setup the path to the scripts, using the default or the manifest entry
    var scriptsPath = getScriptsDir(base, entry)
    //get an array of all the module files we're going to load
    , modulePaths = getModulePaths(base, entry);

    //get the module file data
    var proc = loadModules(modulePaths);

    //merge all of the module objects
    proc = proc.then(function (modules) {
      return mergeModules(modules);
    });

    //use the module to get the list of file paths
    proc = proc.then(function (module) {
      return moduleFileProcessor(entry, module);
    });

    //determine the file type and verify the paths iteratively
    proc = proc.then(function (pathsObj) {
      return modulePathProcessor(scriptsPath, pathsObj);
    });

    //use the collection collector to load the files
    return proc.then(function (paths) {
      //augment the paths and set the files property
      entry.files = augmentPaths(entry, scriptsPath, paths);
      //pass the buck to the standard collection collector
      return collector_collection(base, entry);
    });

  };
}
