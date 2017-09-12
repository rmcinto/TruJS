/**[@test({ "title":"TruJS.cli._Create: creater found" })]*/
function testCreate1(arrange, act, assert, promise, callback, module) {
  var create, creaters, cmdArgs, res;

  arrange(function () {
    creaters = {
      "test": callback(promise.resolve())
    };
    create = module(["TruJS.cli._Create", [, , creaters]]);
    cmdArgs = {
      "create": {
        "test": null
      }
    };
  });

  act(function (done) {
    create(cmdArgs)
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
    test("res is not an error")
      .value(res)
      .not()
      .isError();

    test("creaters.test should be called once")
      .value(creaters, "test")
      .hasBeenCalled(1);

    test("The first arg for the creaters.test should be")
      .value(creaters, "test")
      .hasBeenCalledWithArg(0, 0, cmdArgs);

  });
}

/**[@test({ "title":"TruJS.cli._Create: creater not found" })]*/
function testCreate1(arrange, act, assert, promise, module) {
  var create, creaters, cmdArgs, res;

  arrange(function () {
    creaters = {
      "test": promise.resolve()
    };
    create = module(["TruJS.cli._Create", [, , creaters]]);
    cmdArgs = {
      "create": {
        "nottest": null
      }
    };
  });

  act(function (done) {
    create(cmdArgs)
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
    test("res is an error")
      .value(res)
      .isError();

  });
}
