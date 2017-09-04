/**
* This factory produces a worker function that uses the module.json file to
* create the list of required files
* @factory
*/
function _ModuleCollector(promise, collector_collection, defaults, pathParser, getScriptsDir, moduleFileLoader, moduleFileProcessor, modulePathProcessor) {

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
    var scriptsPath = getScriptsDir(base, entry);

    //get the module file data
    var proc = moduleFileLoader(base, entry);

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
