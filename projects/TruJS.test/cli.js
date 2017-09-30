/**[@naming({ "skip": true })]*/
/**
* @module TruJS.test.cli
*/

var cmdArgs = require("TruJS.cmdArgs")(process.argv)
, trujsTest = require("./index.js")
, trujsTestRun = trujsTest(".run")
;

console.log("** Starting Tests **");
console.log("");

//run the test
trujsTestRun(cmdArgs)
  .then(function (results) {
    results.tests.forEach(printResults);
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
* Prints the results with the detail set by the a and v options
* @function
*/
function printResults(result) {
    var lvl = cmdArgs.options.filter(function (op) { return op === "v"; }).length
    , iterations
    ;
    if (cmdArgs.options.indexOf("a") !== -1 || !result.success) {
        console.log("  #" + (result.num) + " Start Test \"" + result.title + "\"");
        console.log("    Success: " + result.success);
        console.log("    Runtime: " + result.runtimes.total + "ms");

        //level 1 Assertions
        if (lvl > 0)  {

            //Level 2 Iterations
            if (lvl > 1) {
                console.log("    Iterations: " + result.count);
                console.log("    Failed: " + result.failed);
                iterations = result.iterations;
            }
            else {
                iterations = [result.iterations[0]];
            }

            console.log("      Assertions: " + result.assertions);

            for (var i = 0, l = iterations.length; i < l; i++) {
                if (lvl > 1) {
                    console.log("      Iteration #" + (i + 1));
                    console.log("        arrange: " + (iterations[i].runtimes.arrange) + "ms");
                    console.log("        act: " + (iterations[i].runtimes.act) + "ms");
                    console.log("        assert: " + (iterations[i].runtimes.assert) + "ms");
                }

                if (!iterations[i].exception) {
                    var assertions = iterations[i].assertions;
                    for (var a = 0, al = assertions.length; a < al; a++) {
                        console.log("          #" + (a + 1) + " \"" + assertions[a].title + "\"");
                        console.log("          Passed: " + assertions[a].pass);
                        if (!assertions[a].pass) {
                          console.log("          \"" + ((typeof assertions[a].args[0] === "function") ? "function" : JSON.stringify(assertions[a].args[0])) + "\" " + assertions[a].name + " \"" + assertions[a].args[assertions[a].args.length - 1] + "\"");
                        }
                        if (!!assertions[a].exception) {
                            console.log("");
                            console.log(assertions[a].exception);
                            console.log("");
                        }
                    }
                }
                else {
                    console.error(iterations[i].exception);
                }

                console.log("");
            }
        }
    }
}
