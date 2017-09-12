/**[@test({ "title": "TruJS.cli._Operation: project, valid operations" })]*/
function testOperation(arrange, act, assert, callback, promise, module) {
  var operation, operations, cmdArgs, res;

  arrange(function () {
    operations = {
      "test1": callback(promise.resolve("test"))
      , "test2": callback()
      , "test3": callback()
    };
    operation = module(["TruJS.cli._Operation", [, , operations]]);
    cmdArgs = {
      "project": "myproject"
      , "test1": {}
      , "test2": "value"
      , "test3": "value"
    };
  });

  act(function (done) {
    operation(cmdArgs)
      .then(function (results) {
        res = results;
        results()
          .then(function() {
            done();
          })
          .catch(function (err) {
            res = err;
            done();
          });
      })
      .catch(function (err) {
        res = err;
        done();
      });
  });

  assert(function (test) {
    test("res should not be an error")
      .value(res)
      .not()
      .isError();

    test("res should be a function")
      .value(res)
      .isOfType("function");

    test("test1 operation should be called")
      .value(operations.test1)
      .hasBeenCalled(1);

    test("test2 operation should be called")
      .value(operations.test2)
      .hasBeenCalled(1);

    test("test3 operation should be called")
      .value(operations.test3)
      .hasBeenCalled(1);

    test("test1 first arg should be")
      .value(operations.test1)
      .hasBeenCalledWithArg(0, 0, "{projects}/myproject");

    test("test1 2nd arg should be")
      .value(operations.test1)
      .hasBeenCalledWithArg(0, 1, cmdArgs);

    test("test2 1st arg should be")
      .value(operations.test2)
      .hasBeenCalledWithArg(0, 2, "test");

  });
}

/**[@test({ "title": "TruJS.cli._Operation: missing operation" })]*/
function testOperation(arrange, act, assert, callback, promise, module) {
  var operation, operations, cmdArgs, res;

  arrange(function () {
    operations = {};
    operation = module(["TruJS.cli._Operation", [, , operations]]);
    cmdArgs = {
      "project": "myproject"
      , "test1": {}
    };
  });

  act(function (done) {
    operation(cmdArgs)
      .then(function (results) {
        res = results;
        done();
      })
      .catch(function (err) {
        res = err;
        done();
      });
  });

  assert(function (test) {
    test("res should be an error")
      .value(res)
      .isError();

  });
}

/**[@test({ "title": "TruJS.cli._Operation: missing base" })]*/
function testOperation(arrange, act, assert, callback, promise, module) {
  var operation, operations, cmdArgs, res;

  arrange(function () {
    operations = {
      "test1": callback()
    };
    operation = module(["TruJS.cli._Operation", [, , operations]]);
    cmdArgs = {
      "test1": {}
    };
  });

  act(function (done) {
    operation(cmdArgs)
      .then(function (results) {
        res = results;
        done();
      })
      .catch(function (err) {
        res = err;
        done();
      });
  });

  assert(function (test) {
    test("res should be an error")
      .value(res)
      .isError();

  });
}
