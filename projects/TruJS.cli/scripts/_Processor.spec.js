/**[@test({ "title":"TruJS.cli._Processor: create" })]*/
function testProcessor1(arrange, act, assert, callback, module) {
  var processor, create, operation, cmdArgs;

  arrange(function () {
    create = callback();
    operation = callback();
    processor = module(["TruJS.cli._Processor", [create, operation]]);
    cmdArgs = {
      "create": {}
    };
  });

  act(function () {
    processor(cmdArgs);
  });

  assert(function (test) {
    test("create should be called once")
      .value(create)
      .hasBeenCalled(1);

    test("operation should not be called")
      .value(operation)
      .not()
      .hasBeenCalled();

  });
}

/**[@test({ "title":"TruJS.cli._Processor: operation" })]*/
function testProcessor2(arrange, act, assert, callback, module) {
  var processor, create, operation, cmdArgs;

  arrange(function () {
    create = callback();
    operation = callback();
    processor = module(["TruJS.cli._Processor", [create, operation]]);
    cmdArgs = {
      "test": {}
    };
  });

  act(function () {
    processor(cmdArgs);
  });

  assert(function (test) {
    test("operation should be called once")
      .value(operation)
      .hasBeenCalled(1);

    test("create should not be called")
      .value(create)
      .not()
      .hasBeenCalled();

  });
}
