/**
*
* @factory
*/
function _PathProcessor(nodePath, pathParser) {
  var cnsts = {
    "minus": "-"
    , "plus": "+"
  };

  /**
  * Inspects the path to see what it is and returns an object describing it
  * @function
  */
  function processPath(base, curPath) {
    //get the first character to see if it's + or -
    var fch = curPath[0], pathObj;

    //modify the path if it had a + or -
    if (fch === cnsts.minus || fch === cnsts.plus) {
      curPath = curPath.substring(1);
    }

    //convert *.* to just *
    curPath = curPath.replace("*.*", "");

    //parse the path and create the path object
    var pathObj = pathParser(base, curPath);
    pathObj["options"] = {
      "recurse": fch === cnsts.plus
    };
    pathObj["minus"] = fch === cnsts.minus;

    //if there isn't a file then add a wildcard
    if (!pathObj.base) {
      pathObj.base = "*";
    }

    //if this is a minus then lets see if there should be a directory
    if (pathObj.minus) {
      if (pathObj.base === curPath) {
        pathObj.dir = "";
        pathObj.root = "";
      }
    }

    pathObj.path = nodePath.join(pathObj.dir, pathObj.base);

    //if there isn't an extention then this is a directory
    if (!pathObj.ext) {
      pathObj.directory = true;
    }
    //otherwise add the extension to the filter option
    else {
      pathObj.options.filter = pathObj.ext;
    }

    //if there is a wild card in the base then this is a directory
    if (pathObj.base.indexOf("*") !== -1) {
      pathObj.directory = true;
      pathObj.path = pathObj.dir;

      //if the base is not just a wildard then the base is the wildcard
      if (pathObj.base !== "*") {
        pathObj.wildcard = pathObj.base;
      }
      else if (pathObj.minus) {
        pathObj.wildcard = "*";
      }
    }

    //if there is a wildcard in the dir we need to get the base and record the
    // fragment as well as mark this as a directory and recurse
    if (pathObj.dir.indexOf("*") !== -1) {
        pathObj.directory = true;
        pathObj.options.recurse = true;
        pathObj.fragment = pathObj.dir.substring(pathObj.dir.indexOf("*"));
        pathObj.path = pathObj.dir = pathObj.dir.substring(0, pathObj.dir.indexOf("*"));
    }

    return pathObj;
  }

  /**
  * @worker
  */
  return function PathProcessor(base, path) {
    return processPath(base, path);
  };
}
