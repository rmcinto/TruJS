/**
* This factory produces a worker object that is used to add handlers and to
* report progress in the process
*
* @factory
*/
function _Reporter(isInteger) {
  /**
  * Represents the public object for reference instead of `this`
  * @property
  */
  var self
  /**
  * Stores the report handlers
  * @property
  */
  , handlers = []
  /**
  * The report level enum
  * @property
  */
  , LEVEL_ENUM = [
    "all"
    , "error"
    , "stack"
    , "info"
    , "warning"
    , "metric"
    , "extended"
    , "stack"
    , "other"
  ]
  /**
  * The levels that will fire the handlers
  * @property
  */
  , levels = [0,1,2,3]
  ;

  /**
  * Loops through the level value and converts any named levels to the enum index
  * @function
  */
  function convertLevels(value) {
    var levels = [0];
    if (!isArray(value)) {
      if (!isInteger(value)) {
        value = value.split(",");
      }
      else {
        value = [value];
      }
    }
    value.forEach(function (level) {
      levels.push(convertLevel(level));
    });
    return levels;
  }
  /**
  * Converts a string level to the index in the enum
  * @function
  */
  function convertLevel(level) {
    //convert string level to index
    if (!isInteger(level)) {
      level = LEVEL_ENUM.indexOf(level);
    }
    //deal with missing/invalid levels
    if (level >= LEVEL_ENUM.length || level < 0) {
      level = LEVEL_ENUM.length - 1; //other
    }
    return level;
  }

  /**
  * @worker
  */
  return self = Object.create(null, {
    "addHandler": {
      "enumerable": true
      , "value": function addHandler(handler) {
        handlers.push(handler);
      }
    }
    , "setLevel": {
      "enumerable": true
      , "value": function setLevel(value) {
        levels = convertLevels(value);
      }
    }
    , "report": {
      "enumerable": true
      , "value": function report(level, msg) {
        //test to see if we are reporting this level
        if (levels.indexOf(convertLevel(level)) === -1 && levels.indexOf(0) === -1) {
          return;
        }
        //loop through each handler and execute each one
        handlers.forEach(function forEachHandler(handler) {
          handler(msg);
        });
      }
    }
    , "info": {
      "enumerable": true
      , "value": function info(msg) {
        self.report("info", msg);
      }
    }
    , "extended": {
      "enumerable": true
      , "value": function extended(msg) {
        self.report("extended", msg);
      }
    }
    , "metric": {
      "enumerable": true
      , "value": function metric(msg) {
        self.report("metric", msg);
      }
    }
    , "warning": {
      "enumerable": true
      , "value": function warning(msg) {
        self.report("warning", msg);
      }
    }
    , "error": {
      "enumerable": true
      , "value": function error(err) {
        if (!!err.message) {
          self.report("error", err.message);
          self.report("stack", err.stack);
        }
        else {
          self.report("error", err);
        }
      }
    }
  });
}
