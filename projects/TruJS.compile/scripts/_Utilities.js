/**
* Catch all for cross concern utilities
* @object
*/
function _Utilities(nodePath, defaults) {
  var cnsts = {
    "scriptsDir": "scripts"
  };

  return Object.create(null, {
    /**
    * Inspects string data to see what line endings it uses
    * @function
    */
    "getLineEnding": {
      "enumerable": true
      , "value": function getLineEnding(data) {
        if (data.indexOf("\r\n") !== -1) {
          return "\r\n";
        }
        return "\n";
      }
    }
    /**
    * Adds the scripts diretory to the base path based on the manifest entry
    * @function
    */
    , "getScriptsDir": {
      "enumerable": true
      , "value": function getScriptsDir(base, entry) {
        //setup the path to the scripts, using the default or the manifest entry
        var scriptsDir = (!isNill(entry.scripts)) ? entry.scripts : defaults.scriptsDir
        , scriptsPath = nodePath.join(base, scriptsDir);

        return scriptsPath;
      }
    }
  });

}
