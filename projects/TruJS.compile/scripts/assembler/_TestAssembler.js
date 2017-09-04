/**
* This factory produces a worker function that preps the manifest entry for
* processing by the JavaScript Assembler
* @factory
*/
function _TestAssembler(promise, getLineEnding, errors) {
  var cnsts = {
    "default": {
      "testType": "test"
    }
  };
  
  /**
  * Creates one large file with the test objects stitched together
  * @function
  */
  function stitchTest(resolve, reject, files) {
    var lineEnding = getLineEnding(files[0].data)
    , isErr
    , file = {
      "file": "test.json"
      , "name": "test"
      , "ext": ".json"
      , "data": []
    };

    //add a json object entry for each file
    files.forEach(forEachFile);

    if (!isErr) {
      //modify the file.data array to a string
      file.data = "[" + file.data.join(", ") + "]";

      resolve([file]);
    }

    //iterator for each file
    function forEachFile(test) {
      if (!isErr) {
        //check for title or label
        if (!test.title && !test.label) {
          isErr=true;
          reject(new Error(errors.missingTestTitle));
          return;
        }

        //ensure there is a type
        test.type = test.type || cnsts.default.testType;

        //add the test object
        file.data.push(
          "{" + lineEnding +
           (!!test.title && "\t\"title\": \"" + test.title + "\", "  + lineEnding || "") +
           (!!test.label && "\t\"label\": \"" + test.label + "\", "  + lineEnding || "") +
           "\t\"type\": \"" + test.type + "\", "  + lineEnding +
           "\t\"value\": " + test.data + lineEnding +
           "}"
        );
      }
    }
  }

  /**
  * @worker
  */
  return function TestAssembler(entry, files) {

    return new promise(function (resolve, reject) {
      stitchTest(resolve, reject, files);
    });

  };
}
