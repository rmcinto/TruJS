/**
* This factory produces a worker function that tests the scope that a callback
* instance was called with.
* @factory
*/
function _HasBeenCalledWithScope(isMockCallback, isGetValue) {

  /**
  * @worker
  * @type {assertion}
  * @param {callback} cb The callback object to be tested
  * @param {number} num The index of the callback instance
  * @param {object} scope The expected scope for the callback instance
  * @return {boolean}
  */
  return function HasBeenCalledWithScope(cb, num, scope) {

    //they could have called this without a call number, so set it to 0
    if (scope === undefined) {
        scope = num;
        num = 0;
    }

    //see if this is a get value wrapper
    if (isGetValue(scope)) {
        scope = scope();
    }

    if (!isMockCallback(cb)) {
      return [false, ["The value must be a callback to use the HasBeenCalledWithScope assertion", scope]];
    }

    //check the callback count
    if (num >= cb.callbackCount) {
      return [false, ["The callback was not called " + (num + 1) + " times.", scope]];
    }

    var cbScope = cb.getScope(num);

    return [cbScope === scope, [cbScope, scope]];
  };
};
