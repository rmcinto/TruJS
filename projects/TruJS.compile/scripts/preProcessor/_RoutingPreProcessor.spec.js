/**[@test({ "title": "TruJS.compile.preProcessor._RoutingPreprocessor: app and route entries"})]*/
function testRoutingPreProcessor1(arrange, act, assert, callback, promise, module) {
  var routingPreProcessor, preProcessor_module, type_route_server, entry, files, res;

  arrange(function () {
    preProcessor_module = callback(promise.resolve());
    type_route_server = function server() { };
    routingPreProcessor = module(["TruJS.compile.preProcessor._RoutingPreprocessor", [, preProcessor_module, type_route_server]]);
    entry = {
      "root": "Ns"
      , "module": {}
    };
    files = [{
      "data": "/**[@route({ \"type\": \"route\" })]*/"
      , "ext": ".js"
      , "name": "file1"
      , "dir": "My"
    }, {
      "data": "/**[@route({ \"name\": \"My.Name\", \"index\": 0 })]*/"
      , "ext": ".js"
      , "name": "file2"
      , "dir": "My"
    }, {
      "data": "/**[@route({ \"type\": \"app\" })]*/"
      , "ext": ".js"
      , "name": "file3"
      , "dir": "My"
    }, {
      "data": ""
      , "ext": ".js"
      , "name": "file4"
      , "dir": "My"
    }];
  });

  act(function (done) {
    routingPreProcessor(entry, files)
      .then(function (results) {
        res = results;
        done();
      })
      .catch(function (err) {
        res =err;
        done();
      });
  });

  assert(function (test) {
    test("res should not be an error")
      .value(res)
      .not()
      .isError();

    test("module should have 1 property")
      .value(entry, "module")
      .hasPropertyCountOf(1);

    test("module.$$server$$ should have 2 properties")
      .value(entry, "module.$$server$$[0]")
      .hasPropertyCountOf(2);

    test("module.$$server$$.apps should have 1 property")
      .value(entry, "module.$$server$$[0].apps[0]")
      .hasPropertyCountOf(1);

    test("module.$$server$$.routes should have 2 properties")
      .value(entry, "module.$$server$$[0].routes[0]")
      .hasPropertyCountOf(2);

    test("the route0 entry should be passed an object with a type of")
      .value(entry, "module.$$server$$[0].routes[0].route0[1][0].type")
      .equals("route");

    test("the route0 entry should be passed an object with a name of")
      .value(entry, "module.$$server$$[0].routes[0].route0[1][0].name")
      .equals("My.Name");

    test("the route1 entry should be passed an object with a name of")
      .value(entry, "module.$$server$$[0].routes[0].route1[1][0].name")
      .equals("My.file1");

    test("the app0 entry should be passed an object with a type of")
      .value(entry, "module.$$server$$[0].apps[0].app0[1][0].type")
      .equals("app");

    test("the files array should have 5 members")
      .value(files)
      .hasMemberCountOf(5);

    test("the 5th file should have data equal to")
      .value(files, "[4].data")
      .equals("function server() { }");

  });
}
