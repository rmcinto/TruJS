/**
*
* @factory
*/
function _Package(testResolver, testDependencies, testArray) {
    /**
    * @property
    */
    var tests = testArray || []
    /**
    *  A collection of dependency entries, with the external `testDependencies` object as the prototype
    *   name: {the unique name of the dependency}
    *   type: value, singleton, factory
    *   value:
    * @property
    */
    , dependencies = testDependencies || Object.create(null)
    ;

    /**
    * The initializer for the Package, accepting an array of test objects, which
    * have the following properties:
    *   title: {title of the test}
    *   name: {name of the dependency}
    *   type: ["test", "singleton", "factory", "value"]
    *   "value": [code,object,value,string]
    *
    * @function
    */
    function init(tests) {
      if (isArray(tests)) {
        tests.forEach(function forEachTest(test) {

          //we're expecting the value to be stringified
          try {
            var value = eval("(function() { return " + test.value + " })();");
          }
          catch(ex) {
            throw new Error("Failed to parse test \"" + (test.title || test.label) + "\"\n" + ex.message);
          }

          //add the test if the type is test
          if (test.type === "test") {
            add(test.title, value);
          }
          //otherwise it's a dependency
          else {
            addDependency(test.label, test.type, value);
          }

        });
      }
      //return this for chaining
      return this;
    }
    /**
    * Adds returns an object that provides 3 methods to add a dependency with
    * @function
    */
    function setup(name) {
        if (dependencies.hasOwnProperty(name)) {
            throw new Error('The dependency ' + name + ' already exists');
        }
        var me = this;
        return {
            "value": function (value) {
                addDependency(name, 'value', value);
                return me;
            }
            , "singleton": function (fn) {
                addDependency(name, 'singleton', fn);
                return me;
            }
            , "factory": function (fn) {
                addDependency(name, 'factory', fn);
                return me;
            }
        };
    }
    /**
    * Adds a dependency
    * @function
    */
    function addDependency(name, type, value) {
      dependencies[name] = {
          "type": type
          , "value": value
      };
      //return this for chaining
      return this;
    }
    /**
    * Adds a test to the test array
    * @function
    */
    function add(title, test) {
        var me = this;
        tests.push({
            "title": title
            , "factory": test
        });
        return me;
    }
    /**
    * Runs the `testResolver` with the `dependencies` and the `tests`, then returns the results
    * @function
    */
    function resolve() {
        return testResolver(dependencies, tests);
    }

    /**
    * @worker
    */
    return Object.create(null, {
        "add": {
            "enumerable": true
            , "value": add
        }
        , "setup": {
            "enumerable": true
            , "value": setup
        }
        , "init": {
          "enumerable": true
          , "value": init
        }
        , "resolve": {
            "enumerable": true
            , "value": resolve
        }
        , "count": {
            "enumerable": true
            , "get": function getCount() { return tests.length; }
        }
    });
};
