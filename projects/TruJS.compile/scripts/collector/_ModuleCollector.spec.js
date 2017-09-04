/**[@test({ "title": "TruJS.compile.collector._ModuleCollector: " })]*/
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
