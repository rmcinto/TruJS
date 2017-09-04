/**
*
* @factory
*/
function _Resolver(funcWrapper, functionInspector, testRunner) {

    /**
    * Resolves the test with the dependencies
    * @function
    */
    function resolveTest(dependencies, test) {
        var arrange = funcWrapper()
        , act = funcWrapper()
        , assert = funcWrapper();

        //create a linked dependency with the arrange, act, and assert wrappers
        dependencies = Object.create(dependencies, {
            "arrange": {
                "enumerable": true
                , "value": arrange.wrap
            }
            , "act": {
                "enumerable": true
                , "value": act.wrap
            }
            , "assert": {
                "enumerable": true
                , "value": assert.wrap
            }
        });

        //return a function that resolves the test and it's dependencies
        //  and returns the arrange, act, and assert function wrappers
        return function runTest(index) {

            /**
            * @type TruJS.test.TestObject
            */
            var testObj = {
                "index": index
                , "title": test.title
                , "factory": resolveFactory.bind(null, test.factory, dependencies) // deferred so that dependencies that require compilation per iteration are compiled
                , "arrange": arrange
                , "act": act
                , "assert": assert
            };

            return testObj;
        };
    }
    /**
    * Returns the dependency object at `name`, resolving if necessary
    * @function
    */
    function getDependency(name, dependencies) {
        if (!(name in dependencies)) {
            throw new Error("Unable to resolve the dependency '" + name + "'");
        }
        var dependency = dependencies[name];

        //if this is missing a type then it's simply a value
        if (!dependency.type) {
            return dependency;
        }
        //if this is a factory or an unresolved singleton then resolve the factory and return the result
        if (dependency.type === 'factory' || (dependency.type === 'singleton' && !dependency.resolved)) {
            var value = resolveFactory(dependency.value, dependencies);
            if (dependency.type === 'singleton') {
                dependency.resolved = true;
                dependency.value = value;
            }
            return value;
        }

        return dependency.value;
    }
    /**
    * Resolves the dependency by name
    * @function
    */
    function resolveFactory(factory, dependencies) {
        var params = functionInspector(factory).params
        , args = resolveParams(params, dependencies);

        return factory.apply(null, args);
    }
    /**
    * Resolves the dependency by name
    * @function
    */
    function resolveParams(params, dependencies) {
        return params.map(function (param) {
            return getDependency(param, dependencies);
        });
    }

    /**
    * Resolves each test into a resolved test object which includes
    *   title: {the tests title}
    *   arrange: {wrapped arrange function}
    *   act: {wrapped act function}
    *   assert: {wrapped assert function}
    *
    * The test's factory function is ran with the dependencies
    * @worker
    */
    return function Resolver(dependencies, tests) {
        //loop through each test
        var resolvedTests = tests.map(function testMap(test) {
            return resolveTest(dependencies, test);
        });
        //return an object that can be used to run the resolved tests
        return {
            /**
            * Runs the resolved tests
            * @function
            * @param {object} [config] Optional. A configuration object
            *   @config
                    testNums: a comma delimited list of test numbers to run. All are ran if omitted
                    iterations: a number representing the number of times to run each test
                    prime: a boolean identifying if we should run one iteration for priming for profiling
            */
            "run": function (config) {
                return testRunner(resolvedTests, config);
            }
        };
    };
};
