/**
* This factory produces a worker function that tests if a callback was called
* with a certain argument value.
* @factory
*/
function _HasBeenCalledWithArg(isMockCallback, isGetValue) {

    /**
    * @worker
    * @type {assertion}
    * @param {callback} cb The callback object to be tested
    * @param {number} num The index of the callback instance
    * @param {number} index The index of the arguments array
    * @param {any} arg The argument value that is expected
    * @return {boolean}
    */
    return function HasBeenCalledWithArg(cb, num, index, arg) {

      //they could have called this without a call number, so set it to 0
      if (arg === undefined) {
        arg = index;
        index = num;
        num = 0;
      }

      //see if this is a get value wrapper
      if (isGetValue(arg)) {
        arg = arg();
      }

      if (!isMockCallback(cb)) {
        return [false, ["The value must be a callback to use the HasBeenCalledWith assertion", arg]];
      }

      //check the callback count
      if (num >= cb.callbackCount) {
        return [false, ["The callback was not called " + (num + 1) + " times.", arg]];
      }

      //get he args for this call
      var cbArgs = cb.getArgs(num);

      //see if there is an arg at position
      if (cbArgs.length <= index) {
        return [false, ["The callback was not called with " + (index + 1) + " args.", arg]];
      }

      return [cbArgs[index] === arg, [cbArgs[index], arg]];
  };
};
