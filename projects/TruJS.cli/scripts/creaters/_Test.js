/**
* This factory creates a worker function that generates a test file.
*   test:{optional type}
*   title: {optional string representing the title property in the test object}
*   label: {optional string representing the label property in the test object}
*   uut: {optional string identifies the unit under test fqp}
*   fnName: {optinal string used for the literal test function name}
*   file: {optional string used for the test file relative path}
* @factory
*/
function _Test(promise, getBase, nodePath, pathParser, errors, performance) {
  var cnsts = {
    "testFile": [
      "/**[@test({testObj})]*/"
      , "function {functionName}(arrange, act, assert, module) {"
      , "var uut;"
      , ""
      , "\tarrange(function () {"
      , "\t\tuut = module([\"{uut}\", []]);"
      , "\t});"
      , ""
      , "\tact(function () {"
      , "\t\t"
      , "\t});"
      , ""
      , "\tassert(function (test) {"
      , "\t\t"
      , "\t});"
      , "}"
    ]
    , "fileName": "Test"
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
  function getAssets(resolve, reject, basePathObj, name, config) {
    //there should be a test property on the config
    if (config.test === undefined) {
      reject(new Error(errors.missingTestCmd));
      return;
    }
    try {
      var testFile = {
        "path": createTestFilePath(basePathObj, name, config)
        , "data": createTestFileData(config)
      };

      resolve([testFile]);
    }
    catch(ex) {
      reject(ex);
    }
  }
  /**
  * Determines the path of the test file, using the file property, or the uut
  * property, or if both of those, then just test-{ num }
  * @function
  */
  function createTestFilePath(basePathObj, name, config) {
    if (!!config.file) {
      return nodePath.join(basePathObj.path, config.file);
    }
    else if(!!config.uut) {
      return nodePath.join(basePathObj.path, config.uut.replace(name + ".", "").replace(".", "/") + ".js");
    }
    else {
      return cnsts.fileName + "-" + getFileNumber() + ".js";
    }
  }
  /**
  * Uses the config object to create the contents of a test file
  * @function
  */
  function createTestFileData(config) {
    //create the test object
    var testObj = getTestObj(config)
    , uut = config.uut || ""
    , fnName = config.fnName || "testFunction"
    , data = cnsts.testFile.join("\n");

    data = data.replace("{testObj}", testObj);
    data = data.replace("{functionName}", fnName);
    data = data.replace("{uut}", uut);

    return data;
  }
  /**
  * Creates the testObj that is inserted into the test file data, based on the
  * configuration object.
  * @function
  */
  function getTestObj(config) {
    var testObj = {};

    switch(config.test) {
      case "factory":
      case "singleton":
      case "value":
        testObj.type = config.test;
        testObj.label = config.label || "";
        break;
      default:
        delete testObj.type;
        testObj.title = config.title || config.uut || "";
    }

    return JSON.stringify(testObj);
  }
  /**
  * Returns a number that should be unique for the file system
  * @function
  */
  function getFileNumber() {
    return Math.floor(performance.now() * 1000);
  }

  /**
  * @worker
  */
  return function Test(cmdArgs) {

    var proc = new promise(function(resolve, reject) {
      getBasePath(resolve, reject, cmdArgs);
    });

    return proc.then(function (basePathObj) {
      return new promise(function (resolve, reject) {
        getAssets(resolve, reject, basePathObj, cmdArgs.project || cmdArgs.repo, cmdArgs.create);
      });
    });

  };
}
