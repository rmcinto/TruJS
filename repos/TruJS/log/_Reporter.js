/**
* This factory produces a worker object that is used to add handlers and to
* report progress in the process
* @factory
*/
function _Reporter() {

  /**
  * @worker
  */
  return Object.create(null, {
    "_handlers": {
      "enumerable": false
      , "value": []
    }
    , "addHandler": {
      "enumerable": true
      , "value": function(handler) {
        this._handlers.push(handler);
      }
    }
    , "report": {
      "enumerable": true
      , "value": function (type, msg) {
        //loop through each handler and execute each one
        this._handlers.forEach(function forEachHandler(handler) {
          handler(type, msg);
        });
      }
    }
  });
}
