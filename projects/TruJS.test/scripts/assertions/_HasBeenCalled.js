/**
* This factory produces a worker function that tests if a callback has been
* called either a specific number of times, or if it was called at all.
* @factory
*/
function _HasBeenCalled(isMockCallback) {

  /**
  * @worker
  * @type {assertion}
  * @param {callback} cb The callback object to be tested
  * @param {number} [cnt] The expected callback count
  * @return {boolean}
  */
  return function HasBeenCalled(cb, cnt) {
    if (!isMockCallback(cb)) {
      return [false, ["The value must be a callback to use the HasBeenCalled assertion", cnt]];
    }
    if (isNill(cnt)) {
      return [cb.callbackCount > 0, [cb.callbackCount]];
    }
    else {
      return [cb.callbackCount === cnt, [cb.callbackCount, cnt]];
    }
  };
};
