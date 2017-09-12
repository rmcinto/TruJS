/**
* The entry point for the TruJS.cli module. Determines if this is a create or an
* operation
* @factory
*/
function _Processor(create, operation) {

  /**
  * @worker
  */
  return function Processor(cmdArgs) {

    //if there is a create arg
    if (!!cmdArgs.create) {
      return create(cmdArgs);
    }
    //otherwise
    else {
      return operation(cmdArgs);
    }
  };
}
