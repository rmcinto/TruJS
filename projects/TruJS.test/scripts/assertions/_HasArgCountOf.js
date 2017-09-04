/**
* This factory produces a worker function that tests if a callback was called
* with an argument array of a certain length.
* @factory
*/
function _HasArgCountOf(isMockCallback) {

  /**
  * @worker
  * @type {assertion}
  * @param {callback} cb The callback object to be tested
  * @param {number} [num] The index for the callback isntance to be tested
  * @param {number} cnt The count of arguments that are expected
  * @return {boolean}
  */
  return function HasArgCountOf(cb, num, cnt) {

    //they could have called this without a call number, so set it to 0
    if (cnt === undefined) {
      cnt = num;
      num = 0;
    }

    //ensure this is a callback
    if (!isMockCallback(cb)) {
      return [false, ["The value must be a callback to use the HasArgCountOf assertion", cnt]];
    }

    var argCnt = cb.getArgCount(num);

    return [argCnt === cnt, [argCnt, cnt]];
  };
};
