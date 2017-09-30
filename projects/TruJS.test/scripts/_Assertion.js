/**
*
* @factory
*/
function _Assertion($self, assertions, conversions, resolve, isGetValue, arrayFromArguments) {

    Assertion.isTestAssertion = isTestAssertion;

    return Assertion;

    /**
    * @worker
    */
    function Assertion() {
        /**
        * @property
        */
        var results = [];

        /**
        * Starts an assertion chain
        * @function
        */
        function assert(title) {
            return createChainObject(
                createResultObject(title)
            );
        }
        /**
        * Creates the result object and adds it to the results array
        * @funciton
        */
        function createResultObject(title) {
            var result = {
                "title": title
                , "pass": true
            };
            results.push(result);

            return result;
        }
        /**
        * Creates the chain object and adds the assertions
        * @funciton
        */
        function createChainObject(result) {

            //add the common chain-able methods
            var chain = Object.create($self, {
                "value": { //sets the value
                    "enumerable": true
                    , "value": function (value, path) {
                        if (value === "{value}") {
                          value = result.value;
                        }
                        result.value = getValue(value, path);
                        return this;
                    }
                }
                , "run": { //runs a function to set the value
                    "enumerable": true
                    , "value": function (fn, args) {
                        try {
                            //resolve any get values in the args
                            args = resolveArgs(args);
                            // execute the function
                            result.value = fn.apply(null, args);
                        } catch (ex) {
                            result.exception = ex;
                        }
                        return this;
                    }
                }
                , "not": { // sets the not attribute
                    "enumerable": true
                    , "value": function () {
                        result.not = true;
                        return this;
                    }
                }
            });

            //add all of the assertions to the chain object
            addAssertions(chain, result);

            //add all of the conversions to the chain object
            addConversions(chain, result);

            return chain;
        }
        /**
        * Adds the registered assertion functions to the chain
        * @function
        */
        function addAssertions(chain, result) {

            Object.keys(assertions).forEach(function forEachKey(key) {
                var assertion = assertions[key];
                //add the proxy'd assertion
                chain[key] = function () {
                    //create the args array, appending any arguments passed
                    var args = [result.value].concat(arrayFromArguments(arguments));

                    //resolve any get values in the args and set the args property on the result
                    //args = resolveArgs(args); this needs to be done in the assertion function instead
                    result.args = args;

                    //set the assertion type
                    result.name = key;
                    !!result.not && (result.name = 'not ' + result.name);

                    //run the assertion
                    try {
                        var response = assertion.apply(null, args);
                    }
                    catch (ex) {
                        result.exception = ex;
                        response = false;
                    }

                    //see if this is a response entry
                    if (isArray(response)) {
                        var entry = response;
                        response = entry[0]; // the first member is the pass/fail
                        if (!!entry[1]) {
                            result.args = entry[1]; // the second member is the args
                        }
                    }

                    //invert if this is a not, but only if we didn't have an exception
                    !!result.not && !result.exception && (response = !response);

                    //update the pass variable with the response
                    result.pass = result.pass && response;

                    return this;
                };
            });
        }
        /**
        * Adds the registered conversion function to the chain
        * @function
        */
        function addConversions(chain, result) {
            Object.keys(conversions).forEach(function forEachKey(key) {
                //wrap the conversion so we can return the chain object
                chain[key] = function () {
                    var args = [result.value].concat(arrayFromArguments(arguments));

                    result.value = conversions[key].apply(null, args);

                    return this;
                };
            });
        }
        /**
        * Resolves any `getValue` arguments
        * @function
        */
        function resolveArgs(args) {
            return args.map(function (arg) {
                if (isGetValue(arg)) {
                    return arg();
                }
                return arg;
            });
        }
        /**
        * The value chain method, stores the value on the result object
        * @funciton
        */
        function getValue(value, path) {
            if (!!path) {
                return resolve(value, path);
            }
            else {
                return value;
            }
        }

        //set the prototype on the assert for type checking
        Object.setPrototypeOf(assert, $self);

        /**
        * @type TruJS.test.AssertionHelper
        */
        return Object.defineProperties(assert, {
            "results": {
                "enumerable": true
                , "get": function () {
                    return results;
                }
            }
        });
    };

    /**
    * Checks the `obj` to see if it's a TestAssertion
    * @function
    * @static
    */
    function isTestAssertion(obj) {
        Object.getPrototypeOf(obj) === $self;
    };
};
