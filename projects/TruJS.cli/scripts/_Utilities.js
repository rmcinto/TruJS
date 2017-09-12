/**
* This factory produces a worker object that is a catch all for cross concerns
* and orphaned functionality
* @factory
*/
function _Utilities() {

  /**
  * @worker
  */
  return Object.create(null, {
    "getBase": {
      "enumerable": true
      , "value": function getBase(cmdArgs) {
        if (!!cmdArgs.project) {
          return "{projects}/" + cmdArgs.project;
        }
        else if (!!cmdArgs.repo) {
          return "{repos}/" + cmdArgs.repo;
        }
      }
    }
  });
}
