/**[@test({ "title": "TruJS.compile.collector._ModuleCollector: default module file" })]*/
function testModuleCollector1(arrange, act, assert, promise, callback, module) {
  var moduleCollector, collector_collection, paths, moduleFileLoader, moduleFileProcessor, modulePathProcessor, base, entry, res;

  arrange(function () {
    paths = [
      "/base/test1.js"
      , "/base/test2.js"
    ];
    moduleFileLoader = callback(promise.resolve());
    moduleFileProcessor = callback(promise.resolve());
    modulePathProcessor = callback(promise.resolve(paths));
    collector_collection = callback(function (base, entry) {
      return promise.resolve(entry.files);
    });
    moduleCollector = module(["TruJS.compile.collector._ModuleCollector", [, collector_collection, , , , moduleFileLoader, moduleFileProcessor, modulePathProcessor]]);
    base = "/base";
    entry = {
      "files": [
        "/base/test3.js"
      ]
    };
  });

  act(function (done) {
    moduleCollector(base, entry)
      .then(function (results) {
        res = results;
        done();
      })
  });

  assert(function (test) {
    test("There should be 9 paths")
      .value(res)
      .hasMemberCountOf(9);

  });
}

/**[@test({ "title": "TruJS.compile.collector._ModuleCollector: moduleFile parameter" })]*/
function testModuleCollector1(arrange, act, assert, promise, callback, module) {
  var moduleCollector, moduleFileLoader, moduleFileProcessor, base, entry;

  arrange(function () {
    moduleFileLoader = callback(function (path) {
      return {};
    });
    moduleFileProcessor = callback(promise.reject());
    moduleCollector = module(["TruJS.compile.collector._ModuleCollector", [, , , , , moduleFileLoader, moduleFileProcessor]]);
    base = "/base";
    entry = {
      "moduleFile": "other-module.json"
    };
  });

  act(function (done) {
    moduleCollector(base, entry)
      .catch(function () {
        done();
      });
  });

  assert(function (test) {
    test("moduleFileLoader should be called with")
      .value(moduleFileLoader)
      .hasBeenCalledWithArg(0, 0, "\\base\\other-module.json");

  });
}

/**[@test({ "title": "TruJS.compile.collector._ModuleCollector: baseModule parameter" })]*/
function testModuleCollector1(arrange, act, assert, promise, callback, module) {
  var moduleCollector, moduleFileLoader, moduleFileProcessor, base, entry;

  arrange(function () {
    moduleFileLoader = callback(function (path) {
      if (moduleFileLoader.callbackCount === 1) {
        return { "test1" : "test1.1", "test2": "test2" };
      }
      else {
        return { "test1" : "test1.2", "test3": "test3" };
      }
    });
    moduleFileProcessor = callback(promise.reject());
    moduleCollector = module(["TruJS.compile.collector._ModuleCollector", [, , , , , moduleFileLoader, moduleFileProcessor]]);
    base = "/base";
    entry = {
      "baseModule": "{projects}/Other/other-module.json"
    };
  });

  act(function (done) {
    moduleCollector(base, entry)
      .catch(function () {
        done();
      });
  });

  assert(function (test) {
    test("moduleFileLoader should be called 2 times")
      .value(moduleFileLoader)
      .hasBeenCalled(2);

    test("moduleFileProcessor 2nd arg should have 3 properties")
      .run(moduleFileProcessor.getArgs, [0])
      .value("{value}", "[1]")
      .hasPropertyCountOf(3);

    test("moduleFileProcessor 2nd arg \"test1\" property should be")
      .run(moduleFileProcessor.getArgs, [0])
      .value("{value}", "[1].test1")
      .equals("test1.2");

  });
}
