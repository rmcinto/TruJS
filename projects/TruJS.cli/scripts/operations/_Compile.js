/**
* This factory produces a worker function that executes the compiler module and
* returns the results.
* @function
*/
function _Compile(promise, compileRun) {

  /**
  * @worker
  */
  return function Compile(base, cmdArgs) {

    //set the base on the compile object
    cmdArgs.compile = cmdArgs.compile || {};
    cmdArgs.compile.base = base;

    //execute the compiler
    return compileRun(cmdArgs.compile);

  };
}
