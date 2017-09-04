/**[@test({ "title": "TruJS.compile.preProcessor._TestPreProcessor: extract tests" })]*/
function testTestPreProcessor(arrange, act, assert, callback, module) {
  var annotation, testPreProcessor, entry, files, test1, test2, res;

  arrange(function () {
    test1 = "/**[@test({ })]*/\ntest1";
    test2 = "/**[@test({ \"type\": \"factory\" })]*/\ntest2";
    annotation = {
      "extract": callback(function (name, data) {
        return [test1, test2];
      })
      , "lookup": callback(function (name, data) {
        if(annotation.lookup.callbackCount === 0) {
          return {};
        }
        else {
          return { "type": "factory" }
        }
      })
      , "clear": callback()
    };
    testPreProcessor = module(["TruJS.compile.preProcessor._TestPreProcessor", [, annotation]]);
    entry = {};
    files = [{ "data": "", "name": "file" }];
  });

  act(function (done) {
    testPreProcessor(entry, files)
      .then(function (result) {
        res = result;
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
    //console.log(res);
    test("res should have 2 members")
      .value(res)
      .hasMemberCountOf(2);

    test("The 2nd res member should have a file property")
      .value(res, "[1].file")
      .equals("file2.json");

    test("The 2nd res member should have a type property")
      .value(res, "[1].type")
      .equals("factory");

    test("The annotation.lookup callback should be called 2 times")
      .value(annotation, "lookup")
      .hasBeenCalled(2);

    test("The annotation.clear callback should be called 2 times")
      .value(annotation, "clear")
      .hasBeenCalled(2);

  });
}
