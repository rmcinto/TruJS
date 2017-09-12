/**[@test({ "title": "TruJS.cli.operations._Test: test entry in manifest" })]*/
function testTestOperation(arrange, act, assert, callback, promise, module) {
  var testOperation, base, cmdArgs, manifest, res;

  arrange(function () {

    testOperation = module(["TruJS.cli.operations._Test", []]);
    base = "{projects}/myproject";
    cmdArgs = {

    };
    manifest = [{
      "type": "javascript"
    }, {
      "type": "test"
    }];
  });

  act(function (done) {
    testOperation(base, cmdArgs, manifest)
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

  });
}
