/**[@test({ "title": "TruJS.cli.operations._Save: no entry arg, no dest arg" })]*/
function testSaveOperations1(arrange, act, assert, callback, promise, module) {
  var saveOperation, fileSaver, res, base, cmdArgs, manifest, nodeProcess;

  arrange(function () {
    fileSaver = callback(promise.resolve());
    nodeProcess = module([".nodeProcess"]);
    saveOperation = module(["TruJS.cli.operations._Save", [, , fileSaver]]);
    base = "{projects}/myproject";
    cmdArgs = {
      "save": "test"
    };
    manifest = [{
      "output": "./node_modules/myproject"
      , "files": []
    }, {
      "files": []
    }];
  });

  act(function (done) {
    saveOperation(base, cmdArgs, manifest)
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
    test("res should not be an error")
      .value(res)
      .not()
      .isError();

    test("fileSaver should be called twice")
      .value(fileSaver)
      .hasBeenCalled(2);

    test("the path for the 1st call to fileSaver should be")
      .run(fileSaver.getArgs, [0])
      .value("{value}", "[0]")
      .matches(/[/\\]node_modules[/\\]myproject/);

    test("the path for the 2nd call to fileSaver should be")
      .run(fileSaver.getArgs, [1])
      .value("{value}", "[0]")
      .equals(nodeProcess.cwd());

  });
}

/**[@test({ "title": "TruJS.cli.operations._Save: entry arg, dest arg" })]*/
function testSaveOperations1(arrange, act, assert, callback, promise, module) {
  var saveOperation, fileSaver, res, base, cmdArgs, manifest, nodeProcess;

  arrange(function () {
    fileSaver = callback(promise.resolve());
    nodeProcess = module([".nodeProcess"]);
    saveOperation = module(["TruJS.cli.operations._Save", [, , fileSaver]]);
    base = "{projects}/myproject";
    cmdArgs = {
      "save": {
        "dest": "./dest"
        , "entry": "0"
      }
    };
    manifest = [{
      "output": "node_modules/myproject"
      , "files": []
    }, {
      "files": []
    }];
  });

  act(function (done) {
    saveOperation(base, cmdArgs, manifest)
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
    test("res should not be an error")
      .value(res)
      .not()
      .isError();

    test("fileSaver should be called once")
      .value(fileSaver)
      .hasBeenCalled(1);

    test("the path for the 1st call to fileSaver should be")
      .run(fileSaver.getArgs, [0])
      .value("{value}", "[0]")
      .matches(/dest[/\\]node_modules[/\\]myproject/);

  });
}

/**[@test({ "title": "TruJS.cli.operations._Save: fileSaver error" })]*/
function testSaveOperations1(arrange, act, assert, callback, promise, module) {
  var saveOperation, fileSaver, res, base, cmdArgs, manifest, nodeProcess;

  arrange(function () {
    fileSaver = callback(promise.reject(new Error("error")));
    saveOperation = module(["TruJS.cli.operations._Save", [, , fileSaver]]);
    base = "{projects}/myproject";
    cmdArgs = {
      "save": "test"
    };
    manifest = [{
      "output": "./node_modules/myproject"
      , "files": []
    }, {
      "files": []
    }];
  });

  act(function (done) {
    saveOperation(base, cmdArgs, manifest)
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
