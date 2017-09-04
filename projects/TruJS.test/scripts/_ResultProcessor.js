/**
* An object factory that takes in raw test results and returns a formatted `TestResult` object
*
*     example output:
        {
            "success": true
	        , "total": 1
	        , "failed": 0
	        , "tests": [{
		        "title": 'TruJS.some.Module: set something and test it'
		        "success": true
		        // @type [Error]
		        , "exception": null
		        , "count": 1
		        , "runtimes": {
			        "arrange": 1.002
			        , "act": 22.1
			        , "assert": 1.003
			        , "total": 24.105
		        }
		        // @type [TruJS.test.TestIteration]
		        , "iterations": [{
			        "success": true
			        , "runtimes": {
				        "arrange": 1.002
				        , "act": 22.1
				        , "assert": 1.003
				        , "total": 24.105
			        }
			        // @type [TruJS.test.Assert]
			        , "asserts": [{
				        "title": 'The value should equal 1'
				        , "name": 'equal'
				        , "args": [1, 1]
				        , "success": true
			        }]
			        // @type [Error]
			        , "exception": null
		        }]
	        }]
        }
*
* @module TruJS.test.ResultProcessor
* @requires TruJS
*/
function _ResultProcessor() {

    /**
    * Returns a new result object with default properties
    * @function createTestResultObj
    * @private
    * @static
    */
    function createTestResultObj(test) {
        /**
        * A collection for storing test results
        * @type TruJS.test.TestResult
        */
        return {
            "title": test.title
            , "count": test.iterations.length
            , "failed": 0
            , "assertions": 0
            , "success": false
            , "runtimes": null
        };
    }
    /**
    * Returns a test result object
    * @function getTestResults
    * @param {object} test The test object from the tests array
    * @private
    * @static
    */
    function getTestResults(test) {
        //create the container
        var result = createTestResultObj(test);

        //add the number of asserts
        result.assertions = !!test.iterations[0] && !!test.iterations[0].assertions && test.iterations[0].assertions.length || 0;

        !!test.exception && (result.exception = test.exception);

        //loop through the results
        //add the runtime, except if there was an exception for that iteration
        //store last exception,
        result.iterations = test.iterations.map(function (iteration, index) {
            //get the result object for this iteration
            var iterationResult = createIterationObj(iteration, index);

            //add to the failed count if
            !iterationResult.success && (result.failed++);

            return iterationResult;
        });

        //calculate averages
        calcResultAverages(result);

        //set success
        result.failed === 0 && !result.exception && (result.success = true);

        //return the result object
        return result;
    }
    /**
    * Calculates the averages and sets the runtimes
    * @function
    */
    function calcResultAverages(result) {
        //initialize the runtime vars
        var totals = {
            "arrange": {
                "cnt": 0
                , "time": 0
            }
            , "act": {
                "cnt": 0
                , "time": 0
            }
            , "assert": {
                "cnt": 0
                , "time": 0
            }
            , "total": {
                "cnt": 0
                , "time": 0
            }
        };

        //loop through the iterations and sum the runtimes
        result.iterations.forEach(function forEachIteration(iteration) {

            //if there is an arrang eadd the arrange runtime and increment the count
            !isNill(iteration.runtimes.arrange) &&
                (totals.arrange.time += iteration.runtimes.arrange) &&
                    (totals.arrange.cnt++);

            //if there is an act add the arrange runtime and increment the count
            !isNill(iteration.runtimes.act) &&
                (totals.act.time += iteration.runtimes.act) &&
                    (totals.act.cnt++);

            //if there is an assert add the arrange runtime and increment the count
            !isNill(iteration.runtimes.assert) &&
                (totals.assert.time += iteration.runtimes.assert) &&
                    (totals.assert.cnt++);

            //if there is an assert add the total runtime and increment the count
            !isNill(iteration.runtimes.total) &&
                (totals.total.time += iteration.runtimes.total) &&
                    (totals.total.cnt++);
        });

        //calculate the averages
        result.runtimes = {
            "arrange": totals.arrange.time / totals.arrange.cnt || 0
            , "act": totals.act.time / totals.act.cnt || 0
            , "assert": totals.assert.time / totals.assert.cnt || 0
            , "total": totals.total.time / totals.total.cnt || 0
        };
    }
    /**
    * Creates a `TruJS.test.TestIteration` with the test iteration
    * @function createIterationObj
    * @param {object} test The test iteration object
    * @returns {object} `TruJS.test.TestIteration`
    */
    function createIterationObj(iteration, index) {
        /**
        * @type TruJS.test.TestIteration
        */
        return {
            "success": !iteration.exception && assertSuccess(iteration.assertions) || false
            , "num": index + 1
            , "runtimes": {
                "arrange": iteration.arrange || 0
                , "act": iteration.act || 0
                , "assert": iteration.assert || 0
                , "total": (iteration.arrange + iteration.act + iteration.assert) || 0
            }
            , "assertions": iteration.assertions || []
            , "exception": iteration.exception
        };
    }
    /**
    *
    * @function assertSuccess
    * @param {array} assert The assert handler that stores the results
    * @returns {boolean} If all the assertions passed returns true
    */
    function assertSuccess (assert) {
        //loop through the array looking for the assert results
        return assert.every(function(val) {
            return val.pass;
        });
    }

    /**
    * Returns a map of the test results after each one begin processed with the `getTestResults` function
    * @worker
    * @param {array} tests The array of tests
    * @public
    */
    return function ResultProcessor(tests) {
        //create the base object
        var results = {
            "success": null
            , "total": 0
            , "failed": 0
        };
        //loop through each test, run the numbers, and return the array of test results
        results.tests = tests.map(function (val, indx) {
            //get the result object for the test
            var testResult = getTestResults(val);
            //increment the test count
            results.total++;
            //if this is a failure increment that also
            if (!testResult.success) {
                results.failed++;
            }
            //set success, but only if the result.success is not false
            if (results.success !== false) {
                results.success = testResult.success;
            }
            testResult.num = val.index + 1;
            //return the mapped test results
            return testResult;
        });
        //return
        return results;
    };
};
