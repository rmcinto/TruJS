/**[@naming({ "skip": true })]*/
/**
* @module TruJS.test.cli
*/

var cmdArgs = require("TruJS.cmdArgs")(process.argv)
, trujsTest = require("TruJS.test")
, trujsTestRun = trujsTest(".run")
, reporter = trujsTest(".testReporter")
;

//add the report handler
reporter.setListener(reportHandler);

console.log("** Starting Tests **");
console.log("");

//run the test
trujsTestRun(cmdArgs)
  .then(function (results) {
    //console.log(results);
    console.log("");
    console.log("************************************************************");
    console.log("Finished");
    console.log("Success: " + results.success);
    console.log("Total Tests: " + results.total);
    console.log("Failed Tests: " + results.failed);
    console.log("************************************************************");
  })
  .catch(function (err) {
    console.log(err);
  });


/**
* Handler for the test reporter
* @function
*/
function reportHandler(type, entry) {
  if (type === "start-test") {
    console.log("  #" + (entry.index + 1) + " Start Test \"" + entry.title + "\"");
  }
  else if (type === "start-iteration") {
    if (entry.iteration >= 0) {
      console.log("    Starting Iteration " + (entry.iteration + 1));
    }
  }
  else if (type === "end-iteration") {
    if (!!entry.exception) {
      console.error(entry.exception);
    }
    else {
      console.log("      arrange: " + (entry.arrange) + "ms");
      console.log("      act: " + (entry.act) + "ms");
      console.log("      assert: " + (entry.assert) + "ms");
      if (!!entry.assertions) {
        console.log("      assertions (" + entry.assertions.length + ")");
        entry.assertions.forEach(function (assertion, indx) {
          console.log("        #" + (indx + 1) + " \"" + assertion.title + "\"");
          console.log("          Passed: " + assertion.pass);

          if (!assertion.pass) {
            console.log("          \"" + ((typeof assertion.args[0] === "function") ? "function" : JSON.stringify(assertion.args[0])) + "\" " + assertion.name + " \"" + assertion.args[assertion.args.length - 1] + "\"");
          }

          if (!!assertion.exception) {
            console.log("");
            console.log(assertion.exception);
            console.log("");
          }
        });
      }
    }
  }
  else if (type === "end-test") {
    console.log("  #" + (entry.index + 1) + " Finished Test");
    console.log("");
  }
  else if (type === "finished") {
    console.log("");
    console.log("** Processing Results **");
  }

}
