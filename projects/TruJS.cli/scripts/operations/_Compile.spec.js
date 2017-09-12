/**[@test({ "title": "TruJS.cli.operations._Compile: simple test" })]*/
function testCompileOperation(arrange, act, assert, callback, promise, module) {
  var compileOperation, compileRun, base, cmdArgs;

  arrange(function () {
    compileRun = callback();
    compileOperation = module(["TruJS.cli.operations._Compile", [, compileRun]]);
    base = "base";
    cmdArgs = {};
  });

  act(function () {
    compileOperation(base, cmdArgs);
  });

  assert(function (test) {
    test("compilerRun should be called with object having a base property equal to")
      .run(compileRun.getArgs, [0])
      .value("{value}", "[0].base")
      .equals("base");


  });
}
