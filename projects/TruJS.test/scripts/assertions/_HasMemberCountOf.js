/**
* This factory produces a worker function that tests the length of an array.
* @factory
*/
function _HasMemberCountOf() {

  /**
  * @worker
  * @type {assertion}
  * @param {array} value The array to get the length for
  * @param {number} length The expected array length
  * @return {boolean}
  */
  return function HasMemberCountOf(value, length) {
    if (!isArray(value)) {
      return [false, ["The value must be an array for the HasMember assertion.", length]];
    }
    return [value.length === length,[value.length, length]];
  };
};
