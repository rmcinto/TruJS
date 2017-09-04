/**
* This factory produces a worker function that tests the number of properties
* that an object has.
* @factory
*/
function _HasPropertyCountOf() {

  /**
  * @worker
  * @type {assertion}
  * @param {object} value The object to get the propert count for
  * @param {number} cnt The expected count of properties
  * @return {boolean}
  */
  return function HasPropertyCountOf(value, cnt) {
    if (typeof value !== "object") {
      return [false, ["The value must be an object to use the HasPropertyCountOf assertion.", cnt]];
    }

    var propCnt = Object.keys(value).length;

    return [propCnt === cnt, [propCnt, cnt]];
  };
};
