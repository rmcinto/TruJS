/**
* This factory produces a worker function that takes a command line arguments
* object and determines the base and manifest path, loads the manifest, and
* runs the compiler
* @factory
*/
function _Run(promise, nodeFs, nodePath, compiler, defaults, nodeDirName, nodeProcess) {
  var cnsts = {
    "manifest": "manifest.json"
    , "manifestDir": "{script}/manifest.json"
  };

  /**
  * Uses the command line arguments to determine the base and manifest paths
  * @function
  */
  function processArgs(resolve, reject, cmdArgs) {
    var manPath = getManifestPath(cmdArgs)
    , basePath = getBasePath(cmdArgs, manPath);

    nodeFs.readFile(manPath, { "encoding": "utf8" }, readFileCb);

    function readFileCb(err, data) {
      if (!!err) {
        reject(err);
      }
      else {
        parseData(data);
      }
    }

    function parseData(data) {
      try {
        resolve({
          "base": basePath
          , "manifest": JSON.parse(data)
        });
      }
      catch(ex) {
        reject(ex);
      }
    }

  }
  /**
  * Resolves the manifest path
  * @function
  */
  function getManifestPath(cmdArgs) {
    //get the manifest path
    var manPath = cmdArgs.manifest || defaults.manifest.manifestDir;

    if (nodePath.extname(manPath) !== ".json") {
      manPath = nodePath.join(manPath, defaults.manifest.manifestFile);
    }
    manPath = resolvePathSpecials(manPath);
    manPath = nodePath.resolve(manPath);
    return manPath;
  }
  /**
  * Resolves the path that the scripts will originate from. If no cmd arg was
  * specified then use the manifest path
  * @function
  */
  function getBasePath(cmdArgs, manPath) {
    var basePath = cmdArgs.base || nodePath.dirname(manPath);
    basePath = resolvePathSpecials(basePath);
    return basePath;
  }
  /**
  * Replaces the {script} and {cwd} values with __dirname and process.cwd()
  *   respectively
  * @function
  * @param {string} path The path to inspect and replace
  */
  function resolvePathSpecials(path) {
    return path
      .replace(/\{script\}/, nodeDirName)
      .replace(/\{cwd\}/, nodeProcess.cwd())
      .replace(/\{projects\}/, nodePath.join(nodeProcess.cwd(), "projects"))
      .replace(/\{repos\}/, nodePath.join(nodeProcess.cwd(), "repos"))
      ;
  }

  /**
  * @worker
  */
  return function Run(cmdArgs) {

    //parse the command args and load the manifest file
    var proc = new promise(function (resolve, reject) {
      processArgs(resolve, reject, cmdArgs);
    });

    //execute the compiler
    return proc.then(function (settings) {
      return compiler(settings.base, settings.manifest);
    });

  };
}
