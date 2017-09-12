/**[@test({ "title": "TruJS.cli.creaters._Factory: project, fnName, file" })]*/
function testCreateFactory1(arrange, act, assert, callback, module) {
  var createFactory, cmdArgs, res;

  arrange(function () {
    createFactory = module(["TruJS.cli.creaters._Factory", []]);
    cmdArgs = {
      "project": "myproject"
      , "create": {
        "fnName": "MyFunc"
        , "file": "scripts/_MyFunc.js"
      }
    };
  });

  act(function (done) {
    createFactory(cmdArgs)
      .then(function (results) {
        res = results;
        done();
      })
      .catch(function (err) {
        res = err;
        done();
      })
  });

  assert(function (test) {
    test("res should not be an error")
      .value(res)
      .not()
      .isError();

    test("The res should have 1 member")
      .value(res)
      .hasMemberCountOf(1);

    test("res's 1st member's path property should be")
      .value(res, "[0].path")
      .contains("MyFunc.js");

    test("res's 1st member's data property should be")
      .value(res, "[0].data")
      .equals("function _MyFunc() {\n\n\t/**\n\t* @worker\n\t*/\n\tfunction {fnName}() {\n\t\t\n\t};\n}");

  });
}

/**[@test({ "title": "TruJS.cli.creaters._Factory: no project or repo, fnName, file" })]*/
function testCreateFactory2(arrange, act, assert, callback, module) {
  var createFactory, cmdArgs, res;

  arrange(function () {
    createFactory = module(["TruJS.cli.creaters._Factory", []]);
    cmdArgs = {
      "create": {
        "fnName": "MyFunc"
        , "file": "scripts/_MyFunc.js"
      }
    };
  });

  act(function (done) {
    createFactory(cmdArgs)
      .then(function (results) {
        res = results;
        done();
      })
      .catch(function (err) {
        res = err;
        done();
      })
  });

  assert(function (test) {
    test("res should be an error")
      .value(res)
      .isError();

  });
}

/**[@test({ "title": "TruJS.cli.creaters._Factory: project, no fnName, file" })]*/
function testCreateFactory3(arrange, act, assert, callback, module) {
  var createFactory, cmdArgs, res;

  arrange(function () {
    createFactory = module(["TruJS.cli.creaters._Factory", []]);
    cmdArgs = {
      "create": {
        "file": "scripts/_MyFunc.js"
      }
    };
  });

  act(function (done) {
    createFactory(cmdArgs)
      .then(function (results) {
        res = results;
        done();
      })
      .catch(function (err) {
        res = err;
        done();
      })
  });

  assert(function (test) {
    test("res should be an error")
      .value(res)
      .isError();

  });
}

/**[@test({ "title": "TruJS.cli.creaters._Factory: project, fnName, no file" })]*/
function testCreateFactory4(arrange, act, assert, callback, module) {
  var createFactory, cmdArgs, res;

  arrange(function () {
    createFactory = module(["TruJS.cli.creaters._Factory", []]);
    cmdArgs = {
      "create": {
        "fnName": "MyFunc"
      }
    };
  });

  act(function (done) {
    createFactory(cmdArgs)
      .then(function (results) {
        res = results;
        done();
      })
      .catch(function (err) {
        res = err;
        done();
      })
  });

  assert(function (test) {
    test("res should be an error")
      .value(res)
      .isError();

  });
}

/**[@test({ "title": "TruJS.cli.creaters._Factory: repo, fnName, file without name" })]*/
function testCreateFactory5(arrange, act, assert, callback, module) {
  var createFactory, cmdArgs, res;

  arrange(function () {
    createFactory = module(["TruJS.cli.creaters._Factory", []]);
    cmdArgs = {
      "repo": "myrepo"
      , "create": {
        "fnName": "MyFunc"
        , "file": "scripts"
      }
    };
  });

  act(function (done) {
    createFactory(cmdArgs)
      .then(function (results) {
        res = results;
        done();
      })
      .catch(function (err) {
        res = err;
        done();
      })
  });

  assert(function (test) {
    test("res should not be an error")
      .value(res)
      .not()
      .isError();

    test("res should have 1 member")
      .value(res)
      .hasMemberCountOf(1);

    test("res's 1st member's path property should be")
      .value(res, "[0].path")
      .contains("_MyFunc.js");

    test("The saver 1st arg's 1st member's data property should be")
      .value(res, "[0].data")
      .equals("function _MyFunc() {\n\n\t/**\n\t* @worker\n\t*/\n\tfunction {fnName}() {\n\t\t\n\t};\n}");

  });
}
