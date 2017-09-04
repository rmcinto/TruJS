/**
* This factory produces a worker function checks an object's key for a specific
* name
* @factory
*/
function _HasProperty() {

  /**
  * @worker
  * @type {assertion}
  * @param {object} value The object to check
  * @param {string} name The property name to check for
  * @return {boolean}
  */
  return function HasProperty(value, name) {
    if (typeof (value) !== 'object') {
      return [false, ["The value must be an object to run the HasProperty assertion.", name]];
    }

    var keys = Object.keys(value);

    return [keys.indexOf(name) !== -1, [keys, name]];
  };
};
