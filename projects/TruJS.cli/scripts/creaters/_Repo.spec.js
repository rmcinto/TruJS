/**[@test({ "title": "TruJS.cli.creaters._Repo: simple test" })]*/
function testCreaterRepo1(arrange, act, assert, callback, module) {
  var createRepo, cmdArgs, res;

  arrange(function () {
    createRepo = module(["TruJS.cli.creaters._Repo", []]);
    cmdArgs = {
      "create": {
        "repo": "myrepo"
      }
    };
  });

  act(function (done) {
    createRepo(cmdArgs)
      .then(function(results) {
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

    test("res should have 2 members")
      .value(res)
      .hasMemberCountOf(2);

    test("res's 1st member should have path")
      .value(res, "[0].path")
      .contains("myrepo");

  });
}

/**[@test({ "title": "TruJS.cli.creaters._Repo: missing repo name" })]*/
function testCreaterRepo1(arrange, act, assert, callback, module) {
  var createRepo, cmdArgs, res;

  arrange(function () {
    createRepo = module(["TruJS.cli.creaters._Repo", []]);
    cmdArgs = {
      "create": { }
    };
  });

  act(function (done) {
    createRepo(cmdArgs)
      .then(function(results) {
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
