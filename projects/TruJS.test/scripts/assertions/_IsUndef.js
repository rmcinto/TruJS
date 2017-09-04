/**
* This factory produces a worker function that tests a avalue for undefined.
* @factory
*/
function _IsUndef() {

  /**
  * @worker
  * @type {assertion}
  * @param {any} value The value to test for undefined
  * @returns {boolean}
  */
  return function IsUndef(value) {
    return value === undefined;
  };
};
