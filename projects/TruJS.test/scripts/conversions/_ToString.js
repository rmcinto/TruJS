/**
* This factory produces a worker function that runs a value's toString method.
* @factory
*/
function _ToString() {

  /**
  * @worker
  * @type {converter}
  * @param {any} value The value to convert to a string
  * @returns {string}
  */
  return function ToString(value) {
    return value.toString();
  };
};
