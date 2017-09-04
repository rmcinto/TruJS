/**
* This factory produces a worker function that processes TruJS test files,
* extracting all test and setup entries using the @test annotation.
*
* @factory
*/
function _TestPreProcessor(promise, annotation, defaults, stringTrim) {
  
  /**
  * Loops through each file, extracts the tests, and creates files for each
  * adding the test the the TruJS test package
  * @function
  */
  function processFiles(resolve, reject, entry, files) {
    var data = [];

    //loop through the files
    files.forEach(forEachFile);

    resolve(data);

    //iterator for the files forEach
    function forEachFile(file) {
      var tests = extractTests(file);
      if (!isEmpty(tests)) {
        data = data.concat(tests);
      }
    }

  }
  /**
  * Uses the test annotations to extract multiple test entries in a single file
  * @function
  */
  function extractTests(file) {
    //extract the tests from the file
    var tests = annotation.extract("test", file.data);

    //get the test annotation for each test and clear all annotations from text
    return tests.map(function mapTestAns(testData, indx) {
      var testAn = annotation.lookup("test", testData);
      testData = annotation.clear(testData);

      if (!!testData) {
        //trim any leading/trailing CR/LF
        testData = stringTrim(testData, "\\r?\\n?");

        //add the test text to the annotation object
        testAn.data = JSON.stringify(testData);
      }

      //create a new file name and add the basic file properties
      testAn.name = file.name + (indx + 1);
      testAn.ext = ".json";
      testAn.file = file.name + (indx + 1) + ".json";

      return testAn;
    });

  }

  /**
  * @worker
  */
  return function TestPreProcessor(entry, files) {

    //enforce some defaults
    apply(defaults.test, entry);

    return new promise(function (resolve, reject) {
      processFiles(resolve, reject, entry, files);
    });

  };
}
