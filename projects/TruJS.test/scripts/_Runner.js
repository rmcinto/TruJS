/**
* Takes an array of test resolvers and resolves then runs each test for each iteration
* @factory
*/
function _Runner(testReporter, testAssertion, testResultProcessor, promise, getValue, setTimeout, async, arrayPrune, log, performance) {

    /**
    * Creates the promise chain for each test and appends the final
    * @function
    */
    function startTesting(tests, config) {
        var results = []
        //create the starting promise
        , chain = promise.resolve();

        //loop through the tests adding a promise to the chain for each
        tests.forEach(function (testObj) {
            //create the test result object
            var result = createResultObject(testObj);
            //add the initialized result object to the results array
            results.push(result);
            //create promises for each iteration of the test
            chain = createIterationPromises(chain, testObj, config, result);
        });

        //add the final chain
        return chain.then(function () {
            return new promise(function finalPromise(resolve) {
                //one last entry in the test reporter
                testReporter.report('finished', results);

                //create the final result object and resolve the promise with it
                resolve(createFinalResult(results));
            });
        });
    }
    /**
    * Creates a final result object
    * @function
    */
    function createFinalResult(testResults) {
        return testResultProcessor(testResults);
    }
    /**
    * Creates the result object that will store the iteration assertion and exception data
    * @function
    */
    function createResultObject(testObj) {
        return {
            "title": testObj.title
            , "index": testObj.index
            , "iterations": []
        };
    }
    /**
    * Creates and chains a promise for each test for each iteration
    * @function
    */
    function createIterationPromises(chain, testObj, config, result) {

        //create a promise that reports the start of the test
        chain = chain.then(function() {
          testReporter.report('start-test', result);
        });

        //see if the testObj has an exception, from when the factory was ran, missing dependency or junk like that
        if (!!testObj.exception) {

            //resolve the exception, no need to create the iterations
            chain = chain.then(function () {
                return promise.resolve(testObj.exception);
            });
        }
        else {

            //chain a promise for each iteration
            for (var i = (config.prime && -1 || 0); i < config.iterations; i++) {

                //add this iteration to the promise chain
                chain = createIteration(chain, testObj, config, result, i);
            }
        }

        //add the final chain for the test
        return chain.then(function (ex) {

            //store the exception if we have one
            if (!isNill(ex) && config.ignoreException !== true) {
                result.exception = ex;
                //set the result status
                result.status = 'exception';
            }
            else {
                //set the result status
                result.status = 'finished';
            }

            //report the test finished
            testReporter.report('end-test', result);

            //return a resolved promise
            return promise.resolve();
        });
    }
    /**
    * Adds a single iteration to the promise chain
    * @function
    */
    function createIteration(chain, testObj, config, result, iteration) {

      //create a promise for the test iteration
      return chain.then(function (ex) {

        //return a promise for the next iteration
        return new promise(function (resolve) {

          //only run the next test if there isn't an exception on the test
          if (!ex || config.ignoreException === true || iteration === 0) {

            //create a result object for the test iteration
            var iterationResult = createIterationResultObject(testObj, iteration);

            //report the iteration start
            testReporter.report('start-iteration', iterationResult);

            //add the initialized result to the results array
            iteration !== -1 && result.iterations.push(iterationResult);

            //run the test
            runTest(testObj, config, iterationResult, resolve);

          }
          else {
            //return a resolved promise with the
            return promise.resolve(ex);
          }

        });
      });
    }
    /**
    * Creates the result object for the iteration
    * @function
    */
    function createIterationResultObject(testObj, iteration) {
        return {
            "index": testObj.index
            , "iteration": iteration
        };
    }
    /**
    * Creates a test token and runs the test asynchronously
    * @function
    */
    function runTest(testObj, config, result, resolve) {
        //create the test token
        var token = createTestToken(testObj, config, result, resolve);

        try {
            //execute the factory
            testObj.factory();

            //start the test asynchronously
            async(runArrange, [token]);
        }
        catch (ex) {
            handlerError(token, ex);
        }
    }
    /**
    * Creates the test token that will be used for a single test across multiple iterations
    * @function
    */
    function createTestToken(testObj, config, result, resolve) {
        return {
            "testObj": testObj
            , "config": config
            , "result": result
            , "resolve": resolve
        };
    }
    /**
    * Runs the arrange function and then moves on to the act function
    * @function
    */
    function runArrange(token) {
        try {
            token.testObj.arrange.exec();
            token.result.arrange = token.testObj.arrange.runtime;

            runAct(token);
        }
        catch(ex) {
            handlerError(token, ex);
        }
    }
    /**
    * Runs the arrange function, passing a done function to the act function
    * @function
    */
    function runAct(token) {
        try {
            var start = performance.now()
            , done = runActDone.bind(null, token, start);

            token.testObj.act.exec([done]);

            //if the act function has zero parameters then we can execute done
            if (token.testObj.act.params.length === 0) {
                done(0, true);
            }
        }
        catch (ex) {
            handlerError(token, ex);
        }
    }
    /**
    * Called after the act is finished, either from withing the act function or from the runAct function if the act function doesn't implement the done function
    * @function
    */
    function runActDone(token, start, delay, sync) {
        if (!token.isDone) {
            token.isDone = true;
            //calculate and store the runtime
            if (!sync) {
                token.result.act = performance.now() - start;
            }
            else {
                token.result.act = token.testObj.act.runtime;//if this is synchronous then use the function runtime
            }
            //run the assert
            // delaying if a delay is set
            if (!!delay) {
                setTimeout(runAssert, delay, token);
            }
            else {
                runAssert(token);
            }
        }
        else if (token.isDone === true) {
            token.isDone = 'overdone';
            !!log && log.error('runAct: overdone', new Error('The done function was called additional times from "' + token.testObj.title + '"'));
        }
    }
    /**
    * Runs the arrange function and then resolves the promise
    * @function
    */
    function runAssert(token) {
        try {
            //create the assertion object
            var assertions = testAssertion();

            token.testObj.assert.exec([assertions, getValue]);
            token.result.assert = token.testObj.assert.runtime;

            token.result.assertions = assertions.results;

            //finalize the test
            finalizeTest(token);
        }
        catch (ex) {
            handlerError(token, ex);
        }
    }
    /**
    * Stores the exception and then resolves the promise with the exception
    * @function
    */
    function handlerError(token, ex) {
        //store the exception
        token.result.exception = ex;
        finalizeTest(token, ex);
    }
    /**
    * Runs the test reporter and then resolves the promise
    * @function
    */
    function finalizeTest(token, ex) {
        //add the result to the reporter
        token.result.iteration !== -1 && testReporter.report('end-iteration', token.result);

        //resolve the promise
        token.resolve(ex);
    }
    /**
    * Creates the config object, if missing, and ensures required values are set
    * @function
    */
    function processConfig(config) {
        //process the testNums if we have any
        if (!!config.testNums) {
            //let's ensure testNums is an array
            if (!isArray(config.testNums)) {
                config.testNums = [config.testNums];
            }
            //convert testNums to numbers
            config.testNums = config.testNums.map(function mapTestNums(val) {
                return parseInt(val);
            });
        }

        //create the config object if missing
        //apply the default values if missing
        return applyIf({
            "testNums": 'all'
            , "iterations": 1
            , "prime": config.prime !== 'false'
        }, config || {});
    }

    /**
    * @worker
    */
    return function Runner(tests, config) {
        //ensure we have a config object
        config = processConfig(config);

        //loop through the tests
        // to preserve the index, aka the test number, we'll use a map, return undefined for
        // anything that isn't in the testNums list
        var testList = tests.map(function testMap(test, index) {
            if (config.testNums === 'all' || isEmpty(config.testNums) || config.testNums.indexOf(index + 1) !== -1) {
                //execute the test factory and get the test object
                // passing in the index adds it to the test object
                return test(index);
            }
        });

        //prune the undefined
        testList = arrayPrune(testList);

        //start the test and return a promise
        return startTesting(testList, config);
    };
};
