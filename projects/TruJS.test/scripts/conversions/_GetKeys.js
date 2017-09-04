/**
* This factory produces a worker function that returns an array of object keys
* if the value is an object. Otherwise returns "not an object".
* @factory
*/
function _GetKeys() {

  /**
  * @worker
  * @type {converter}
  * @param {object} value The object to get the keys factory
  * @returns {array}
  */
  return function GetKeys(value) {
    return typeof value === "object" && Object.keys(value) || "not an object";
  };
};
