/**
* This factory produces a worker function that returns an array of arguments
* sent to a callback
* @factory
*/
function _GetCallbackArgs(isMockCallback) {

  /**
  * @worker
  * @type {converter}
  * @param {object} cb The callback
  * @param {number} num The index of the callback instance
  * @returns {array}
  */
  return function GetCallbackArgs(cb, num) {
    //they could have called this without a call number, so set it to 0
    if (isNill(num)) {
      num = 0;
    }

    if (!isMockCallback(cb)) {
      return "The value must be a callback to use the GetCallbackArgs conversion";
    }

    //check the callback count
    if (num >= cb.callbackCount) {
      return "The callback was not called " + (num + 1) + " times.";
    }

    //get he args for this call
    var cbArgs = cb.getArgs(num);

    return cbArgs;
  };
};
