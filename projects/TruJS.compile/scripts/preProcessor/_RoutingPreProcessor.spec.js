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
      "data": "/**[@route({ \"name\": \"My.Name\", \"label\": \"myroute\" })]*/"
      , "ext": ".js"
      , "name": "file2"
      , "dir": "My"
    }, {
      "data": "/**[@route({ \"type\": \"app\", \"index\": 1, \"routes\": \"route0,myroute\", \"path\": \"/\" })]*/"
      , "ext": ".js"
      , "name": "file3"
      , "dir": "My"
    }, {
      "data": "/**[@route({ \"type\": \"app\", \"label\": \"auth\", \"routes\": [\"myroute\"] })]*/"
      , "ext": ".js"
      , "name": "file3"
      , "dir": "My"
    }, {
      "data": "/**[@route({ \"type\": \"app\", \"index\": 0, \"label\": \"app\", \"routes\": \"myroute\", \"path\": \"/order\" })]*/"
      , "ext": ".js"
      , "name": "file3"
      , "dir": "My"
    }, {
      "data": "/**[@route({ \"type\": \"route\" })]*/"
      , "ext": ".js"
      , "name": "file4"
      , "dir": "My"
    }, {
      "data": ""
      , "ext": ".js"
      , "name": "file5"
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

    test("entry.module should have 5 properties")
      .value(entry, "module")
      .hasPropertyCountOf(5);

    test("$$server$$ should have 2 properties")
      .value(entry, "module.$$server$$[0]")
      .hasPropertyCountOf(2);


    test("$$server$$ apps should have 2 properties")
      .value(entry, "module.$$server$$[0].apps[0]")
      .hasPropertyCountOf(2);

    test("The app, app shoud be")
      .value(entry, "module.$$server$$[0].apps[0].app")
      .stringify()
      .equals("{\"label\":\"app\",\"routes\":{\"/order\":[\"appRoute1\",\"myroute\"],\"/\":[\"appRoute2\",\"route0\",\"myroute\"]}}");

    test("The auth app should be")
      .value(entry, "module.$$server$$[0].apps[0].auth")
      .stringify()
      .equals("{\"label\":\"auth\",\"routes\":{\"/\":[\"appRoute0\",\"myroute\"]}}");


    test("$$server$$ routes should have 6 properties")
      .value(entry, "module.$$server$$[0].routes[0]")
      .hasPropertyCountOf(6);

    test("The route, appRoute0 should be")
      .value(entry, "module.$$server$$[0].routes[0].appRoute0")
      .stringify()
      .equals("[{\"factory\":[\"My.file3\",[]],\"meta\":{\"type\":\"app\",\"label\":\"appRoute0\",\"name\":\"My.file3\",\"method\":\"all\"}}]");

    test("The route, myroute should be")
      .value(entry, "module.$$server$$[0].routes[0].myroute")
      .stringify()
      .equals("[{\"factory\":[\"My.Name\",[]],\"meta\":{\"name\":\"My.Name\",\"label\":\"myroute\",\"type\":\"route\",\"method\":\"all\",\"path\":\"/\"}}]");

    test("The route, route0 should be")
      .value(entry, "module.$$server$$[0].routes[0].route0")
      .stringify()
      .equals("[{\"factory\":[\"My.file1\",[]],\"meta\":{\"type\":\"route\",\"name\":\"My.file1\",\"method\":\"all\",\"path\":\"/\",\"label\":\"route0\"}}]");

  });
}
