/**
* This factory produces a worker function that check to see if a value is an
* Error type.
* @factory
*/
function _IsError() {

  /**
  * @worker
  * @type {assertion}
  * @param {any} value The value to test for error
  * @returns {boolean}
  */
  return function IsError(value) {
    return isError(value);
  };
};
