/**
* This factory produces a worker function that checks that a value exists in an
* array.
* @factory
*/
function _HasMember() {

  /**
  * @worker
  * @type {assertion}
  * @param {array} value The array to test for the member
  * @param {any} member The value expected to be in the array
  * @return {boolean}
  */
  return function HasMember(value, member) {
    if (!isArray(value)) {
      return [false, ["The value must be an array for the HasMember assertion.", member]];
    }
    return [value.indexOf(member) !== -1, [value, member]];
  };
};
