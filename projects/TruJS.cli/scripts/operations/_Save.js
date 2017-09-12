/**
* This factory produces a worker function that saves the manifest entries
* returned from the compile operation.
* @function
*/
function _Save(promise, getEntryArg, fileSaver, pathParser, nodePath) {

  /**
  * Loops through the manifest entries and runs the file save for each
  * @function
  */
  function saveFiles(resolve, reject, cmdArgs, manifest) {
    var dest = cmdArgs.save.dest
    , entryList = getEntryArg(cmdArgs.save)
    , procs = [];

    manifest.forEach(function forEachEntry(entry, indx) {
      if (entryList === "all" || entryList.indexOf(indx + "") !== -1) {
        entry.output = getOutput(dest, entry);
        procs.push(fileSaver(entry.output, entry.files));
      }
    });

    promise.all(procs)
      .then(function () {
        resolve(manifest);
      })
      .catch(function (err) {
        reject(err);
      });
  }
  /**
  * If there was a dest path passed with the arguments use that. Append the
  * entry output path if it's relative.
  * @function
  */
  function getOutput(dest, entry) {
    if (!!dest) {
      if (!!entry.output && !nodePath.isAbsolute(entry.output)) {
        dest = pathParser(dest, entry.output).path;
      }
      return dest;
    }
    else if (!!entry.output) {
      return pathParser(entry.output).path;
    }
    else {
      return pathParser("./").path;
    }
  }

  /**
  * @worker
  */
  return function Save(base, cmdArgs, manifest) {

    return new promise(function (resolve, reject) {
      saveFiles(resolve, reject, cmdArgs, manifest);
    });

  };
}
