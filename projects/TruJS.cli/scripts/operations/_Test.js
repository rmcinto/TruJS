/**
* This factory produces a worker function that executes the TruJS.test module
* for either, 1. all test entries in the manifest, or 2. it compiles a generic
* test entry using either the `filter` option or the default *.spec.js.
* @function
*/
function _Test(promise, compiler) {
  var cnsts = {
    "genericFilter": "*.spec.js"
  };

  /**
  * Filters the manifest for `type`="test" entries
  * @function
  */
  function getTestEntries(manifest) {
    return manifest.filter(function filterManifest(entry) {
      return entry.type === "test";
    });
  }
  /**
  * Creates a generic test entry
  * @function
  */
  function getGenericEntry(cmdArgs) {
    var filter = cmdArgs.test.filter;
    if (!!filter) {
      filter = filter.split(",");
    }
    else {
      filter = [cnsts.genericFilter];
    }

    return {
      "type": "test"
      , "files": filter
    };
  }
  /**
  *
  * @function
  */
  function runTests(resolve, reject, entries) {

  }

  /**
  * @worker
  */
  return function Test(base, cmdArgs, manifest) {

    var testEntries = getTestEntries(manifest)
    , proc = promise.resolve(testEntries)
    , genEntry
    ;

    //if there aren't any test entries then we'll run the compile for a generic
    if (testEntries.length === 0) {
      proc = proc.then(function () {
        genEntry = getGenericEntry(cmdArgs);
        return compiler(base, [genEntry]);
      });
    }

    //run the test module for each test entry
    proc = proc.then(function (tests) {
      return new promise(function (resolve, reject) {

      });
    });


  };
}
