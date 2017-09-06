/**
* This factory produces a worker function that tests if a value ends with a
* value
* @factory
*/
function _EndsWith(isGetValue) {

  /**
  * @worker
  * @type {assertion}
  * @param {string} value1 One of the values to be tested
  * @param {string} value2 One of the values to be tested. Can be a getValue wrapper
  * @return {boolean}
  */
  return function EndsWith(value1, value2) {
    //see if this is a get value wrapper
    if (isGetValue(value2)) {
      value2 = value2();
    }

    var patt = new RegExp(".*?" + value2 + "$");

    return patt.test(value1);
  };
};
