/**
* This factory produces a worker function that tests, strictly, if a value is
* equal to another value.
* @factory
*/
function _Equals(isGetValue) {

  /**
  * @worker
  * @type {assertion}
  * @param {all} value1 On of the values to be tested
  * @param {all} value2 On of the values to be tested. Can be a getValue wrapper
  * @return {boolean}
  */
  return function Equals(value1, value2) {
    //see if this is a get value wrapper
    if (isGetValue(value2)) {
      value2 = value2();
    }

    return value1 === value2;
  };
};
