/**
* The factory provides a worker function that checks if the value is a callback,
* then checks to see if the callback was called with the arguments passed
* @factory
*/
function _HasBeenCalledWith(isMockCallback, isGetValue) {

  /**
  * @worker
  * @type {assertion}
  * @param {callback} cb The callback object to be tested
  * @param {number} num The index of the callback instance
  * @param {array} args The args array that is expected
  * @param {number} num The index of the callback instance
  * @return {boolean}
  */
  return function HasBeenCalledWith(cb, num, args) {

    //they could have called this without a call number, so set it to 0
    if (!args && isArray(num)) {
      args = num;
      num = 0;
    }

    //see if this is a get value wrapper
    if (isGetValue(args)) {
      args = args();
    }

    if (!isMockCallback(cb)) {
      return [false, ["The value must be a callback to use the HasBeenCalledWith assertion", args]];
    }

    //check the callback count
    if (num >= cb.callbackCount) {
      return [false, ["The callback was not called " + (num + 1) + " times.", args]];
    }

    //get he args for this call
    var cbArgs = cb.getArgs(num);

    //check the args count against the callback arg count
    if (cbArgs.length !== args.length) {
      return false;
    }

    //check each arg
    return [cbArgs.filter(function (arg, index) { return args[index] !== arg; }).length === 0, [cbArgs, args]];
  };
};
