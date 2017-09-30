/**
* This factory produces a worker function that takes the command line arguments
* object, loads the test files and runs it
* @factory
*/
function _Run(promise, nodePath, nodeFs, nodeRequire, errors, defaults, testPackage, nodeCwd) {
  var PATH_PATT = /[./\\]/
  ;

  /**
  * Gets the file name from the command line args, and load the file
  * @function
  */
  function loadTestFile(resolve, reject, cmdArgs) {
    //get the file entry
    var path = cmdArgs.file;

    //reject if we are missing the path
    if (!path) {
      reject(new Error(errors.missingTestFileArg));
      return;
    }

    //format the path
    path = formatPath(path);

    //load the test file data
    nodeFs.readFile(path, "utf8", readFileCb);

    //handler for the read file callback
    function readFileCb(err, data) {
      if(!!err) {
        reject(err);
      }
      else {
        processTestData(resolve, reject, data);
      }
    }

  }
  /**
  * Formats the test file path
  * @function
  */
  function formatPath(path) {
    //add the default file name if missing
    if (path.indexOf(".js") === -1) {
      path = nodePath.join(path, defaults.testFile);
    }

    //update the special segments
    Object.keys(defaults.testPath)
      .forEach(function forEachSeg(seg) {
        path = path.replace( "{" + seg + "}", defaults.testPath[seg]);
      });

    return path;
  }
  /**
  * JSON.parse the test file data
  * @function
  */
  function processTestData(resolve, reject, data) {
    try{
      resolve(JSON.parse(data));
    }
    catch(ex) {
      reject(ex);
    }
  }
  /**
  * Add the tests to the test package, and the module if there is a module name
  * in the command args
  * @function
  */
  function updatePackage(resolve, reject, tests, cmdArgs) {
    try {
      //init the package with the tests
      testPackage.init(tests);

      //add the module if there is a module arguments
      if (!!cmdArgs.module) {
        var module = getModulePath(cmdArgs.module);
        testPackage.setup("module")["value"](nodeRequire(module));
      }

      //resolve all the tests, start the runner
      var runner = testPackage.resolve().run(cmdArgs);

      resolve(runner);
    }
    catch(ex) {
      reject(ex);
    }
  }
  /**
  *
  * @function
  */
  function getModulePath(module) {
      if (PATH_PATT.exec(module)) {
          return nodePath.join(nodeCwd, module);
      }
      return module;
  }

  /**
  * @worker
  */
  return function Run(cmdArgs) {

    //load the test file
    var proc =  new promise(function (resolve, reject) {
      loadTestFile(resolve, reject, cmdArgs);
    });

    //execute the test runner
    proc = proc.then(function(tests) {
      return new Promise(function (resolve, reject) {
        updatePackage(resolve, reject, tests, cmdArgs);
      });
    });

    return proc;
  };
}
