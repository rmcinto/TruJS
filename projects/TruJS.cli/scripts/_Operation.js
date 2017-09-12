/**
* This factory produces a worker function that determines the operation base and
* then creates a chain function.
* @factory
*/
function _Operation(promise, errors, operations) {
  var cnsts ={
    "base": [
      "project"
      , "repo"
    ]
  };

  /**
  * Checks the cmdArgs for either a repo or project entry, throwing an error if
  * neither exist
  * @function
  * @param {object} cmdArgs An object that represents the command line arguments
  */
  function getOperationBase(resolve, reject, cmdArgs) {
    if (!!cmdArgs.project) {
      resolve("{projects}/" + cmdArgs.project);
    }
    else if (!!cmdArgs.repo) {
      resolve("{repos}/" + cmdArgs.repo);
    }
    else {
      reject(new Error(errors.missingBase));
    }
  }
  /**
  * Inspects the arguments to determine which operations we're going to chain
  * together, generates a function that creates the chain, and returns the
  * function.
  * @function
  */
  function createOperationFn(resolve, reject, cmdArgs, base) {
     var ops = [];

    //loop through all of the command arguments
    if (!!Object.keys(cmdArgs).every(everyKey)) {
      //create the chain function, resolve the promise
      resolve(createChain(base, cmdArgs, ops));
    }

    //iterator for the command arguments
    function everyKey(key) {
      //weed out all of the base entries
      if (cnsts.base.indexOf(key) === -1) {
        //reject if this key doesn't represent an operation
        if (!operations[key]) {
          reject(new Error(errors.invalidOperation.replace("{key}", key)));
          return false;
        }
        //add the operation object to the list
        ops.push(operations[key]);
      }
      return true;
    }

  }
  /**
  * Creates a function that when executed creates and returns a promise chain
  * with all of the operations and returns the chain.
  * @function
  */
  function createChain(base, cmdArgs, ops) {

    return function chain() {
      var proc = promise.resolve();

      ops.forEach(function (op) {
        proc = proc.then(function (results) {
          return op(base, cmdArgs, results);
        });
      });

      return proc;
    };

  }

  /**
  * @worker
  */
  return function Operation(cmdArgs) {

    var proc = new promise(function (resolve, reject) {
      getOperationBase(resolve, reject, cmdArgs);
    });

    proc = proc.then(function (base) {
      return new promise(function (resolve, reject) {
        createOperationFn(resolve, reject, cmdArgs, base);
      });
    });

    return proc;
  };
}
