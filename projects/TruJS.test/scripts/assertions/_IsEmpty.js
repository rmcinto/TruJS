/**
* This factory produces a worker function that checks if a value is empty. This
* works for string, array, and object.
* @factory
*/
function _IsEmpty() {

  /**
  * @worker
  * @type {assertion}
  * @param {any} value The value to test for emptiness
  * @returns {boolean}
  */
  return function IsEmpty(value) {
    return isEmpty(value);
  };
};
