/**[@test({ "title":"TruJS.cli.creaters._Project: single manifest entry, no module"})]*/
function testCreateProject1(arrange, act, assert, callback, module) {
  var createProject, cmdArgs, res;

  arrange(function () {
    createProject = module(["TruJS.cli.creaters._Project", []]);
    cmdArgs = {
      "create": {
        "project": "myproject"
        , "manifest": "module"
      }
    };
  });

  act(function (done) {
    createProject(cmdArgs)
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

    test("res should have 4 members")
      .value(res)
      .hasMemberCountOf(4);

    test("res's 1st member should be a directory")
      .value(res, "[0].isDirectory")
      .isTrue();

    test("res's 1st member path should contain")
      .value(res, "[0].path")
      .contains("myproject");

    test("res's 2nd member should be a directory")
      .value(res, "[1].isDirectory")
      .isTrue();

    test("res's 4th member data should be")
      .value(res, "[3].data")
      .equals("{\n\t\"type\": \"module\",\n\t\"name\": \"myproject\"\n}");

  });
}

/**[@test({ "title":"TruJS.cli.creaters._Project: multiple manifest entries, no module"})]*/
function testCreateProject2(arrange, act, assert, callback, module) {
  var createProject, cmdArgs, res;

  arrange(function () {
    createProject = module(["TruJS.cli.creaters._Project", []]);
    cmdArgs = {
      "create": {
        "project": "myproject"
        , "manifest": "module,javascript,files"
      }
    };
  });

  act(function (done) {
    createProject(cmdArgs)
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

    test("res should have 4 members")
      .value(res)
      .hasMemberCountOf(4);

    test("res's 4th member data should be")
      .value(res, "[3].data")
      .equals("{\n\t\"type\": \"module\",\n\t\"name\": \"myproject\"\n},\n{\n\t\"type\": \"javascript\",\n\t\"name\": \"myproject\"\n},\n{\n\t\"type\": \"files\",\n\t\"name\": \"myproject\"\n}");

  });
}

/**[@test({ "title":"TruJS.cli.creaters._Project: module entry with root"})]*/
function testCreateProject3(arrange, act, assert, callback, module) {
  var createProject, cmdArgs, res;

  arrange(function () {
    createProject = module(["TruJS.cli.creaters._Project", []]);
    cmdArgs = {
      "create": {
        "project": "myproject"
        , "manifest": "module"
        , "module": "TruJS"
      }
    };
  });

  act(function (done) {
    createProject(cmdArgs)
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

    test("res should have 5 members")
      .value(res)
      .hasMemberCountOf(5);

    test("res's 5th member data should be")
      .value(res, "[4].data")
      .equals("{\n\t\"root\": [{ \"TruJS\": [\":TruJS\"]}]\n}");

  });
}

/**[@test({ "title":"TruJS.cli.creaters._Project: module entry without root"})]*/
function testCreateProject4(arrange, act, assert, callback, module) {
  var createProject, cmdArgs, res;

  arrange(function () {
    createProject = module(["TruJS.cli.creaters._Project", []]);
    cmdArgs = {
      "create": {
        "project": "myproject"
        , "manifest": "module"
        , "module": null
      }
    };
  });

  act(function (done) {
    createProject(cmdArgs)
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

    test("res should have 5 members")
      .value(res)
      .hasMemberCountOf(5);

    test("res's 5th member data should be")
      .value(res, "[4].data")
      .equals("{\n}");

  });
}

/**[@test({ "title":"TruJS.cli.creaters._Project: missing project name"})]*/
function testCreateProject5(arrange, act, assert, callback, module) {
  var createProject, cmdArgs, res;

  arrange(function () {
    createProject = module(["TruJS.cli.creaters._Project", []]);
    cmdArgs = {
      "create": {
        "manifest": "module"
      }
    };
  });

  act(function (done) {
    createProject(cmdArgs)
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
