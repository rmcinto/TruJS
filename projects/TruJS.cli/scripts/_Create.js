/**
* This factory produces a worker function that inspects the cmdArgs for the
* create option and executes the appropriate creater module
* @factory
*/
function _Create(promise, errors, creaters) {

  /**
  * Uses the first create option to lookup the creater
  * @function
  */
  function getCreater(resolve, reject, create) {
    var key = Object.keys(create)[0];

    if (key in creaters) {
      resolve(creaters[key]);
    }
    else {
      reject(new Error(errors.invalidCreater.replace("{key}", key)));
    }
  }

  /**
  * @worker
  */
  return function Create(cmdArgs) {

    //find the creater, it should be the first key
    var proc = new promise(function (resolve, reject) {
      getCreater(resolve, reject, cmdArgs.create);
    });

    //run the creater
    return proc = proc.then(function (creater) {
      return creater(cmdArgs);
    });

  };
}
