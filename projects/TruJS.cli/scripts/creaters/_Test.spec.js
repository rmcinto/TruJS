/**[@test({ "title": "TruJS.cli.creaters._Test: project, no test type, no uut, no fnName"})]*/
function testCreateTest1(arrange, act, assert, callback, module) {
  var createTest, cmdArgs, res;

  arrange(function () {
    createTest = module(["TruJS.cli.creaters._Test", []]);
    cmdArgs = {
      "project": "myproject"
      , "create": {
        "test": null
      }
    };
  });

  act(function (done) {
    createTest(cmdArgs)
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

    test("res should have one member")
      .value(res)
      .hasMemberCountOf(1);

    test("res's 1st member's path property should contain")
      .value(res, "[0].path")
      .contains("Test-");

    test("res's 1st member's data property should be")
      .value(res, "[0].data")
      .equals("/**[@test({\"title\":\"\"})]*/\nfunction testFunction(arrange, act, assert, module) {\nvar uut;\n\n\tarrange(function () {\n\t\tuut = module([\"\", []]);\n\t});\n\n\tact(function () {\n\t\t\n\t});\n\n\tassert(function (test) {\n\t\t\n\t});\n}");

  });
}

/**[@test({ "title": "TruJS.cli.creaters._Test: project, test type, uut, no fnName"})]*/
function testCreateTest2(arrange, act, assert, callback, module) {
  var createTest, cmdArgs, res;

  arrange(function () {
    createTest = module(["TruJS.cli.creaters._Test", []]);
    cmdArgs = {
      "project": "myproject"
      , "create": {
        "test": "factory"
        , "label": "myLabel"
        , "uut": "myproject.ns._Test"
      }
    };
  });

  act(function (done) {
    createTest(cmdArgs)
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

    test("res's 1st member's path property should contain")
      .value(res, "[0].path")
      .contains("myproject");

    test("res's 1st member's path property should contain")
      .value(res, "[0].path")
      .contains("_Test.js");

    test("res's 1st member's data property should be")
      .value(res, "[0].data")
      .equals("/**[@test({\"type\":\"factory\",\"label\":\"myLabel\"})]*/\nfunction testFunction(arrange, act, assert, module) {\nvar uut;\n\n\tarrange(function () {\n\t\tuut = module([\"myproject.ns._Test\", []]);\n\t});\n\n\tact(function () {\n\t\t\n\t});\n\n\tassert(function (test) {\n\t\t\n\t});\n}");

  });
}

/**[@test({ "title": "TruJS.cli.creaters._Test: project, test type, no uut, file, fnName"})]*/
function testCreateTest2(arrange, act, assert, callback, module) {
  var createTest, cmdArgs, res;

  arrange(function () {
    createTest = module(["TruJS.cli.creaters._Test", []]);
    cmdArgs = {
      "project": "myproject"
      , "create": {
        "test": null
        , "title": "title for the test"
        , "file": "ns/_Test.js"
        , "fnName": "testMyProject"
      }
    };
  });

  act(function (done) {
    createTest(cmdArgs)
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

    test("res's 1st member's path property should contain")
      .value(res, "[0].path")
      .contains("myproject");

    test("res's 1st member's path property should contain")
      .value(res, "[0].path")
      .contains("_Test.js");

    test("res's 1st member's data property should be")
      .value(res, "[0].data")
      .equals("/**[@test({\"title\":\"title for the test\"})]*/\nfunction testMyProject(arrange, act, assert, module) {\nvar uut;\n\n\tarrange(function () {\n\t\tuut = module([\"\", []]);\n\t});\n\n\tact(function () {\n\t\t\n\t});\n\n\tassert(function (test) {\n\t\t\n\t});\n}");

  });
}
