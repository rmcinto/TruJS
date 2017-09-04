/**
*
* @factory
* @params {timestamp} originTimestamp The timestamp recorded at initialization
*/
function _Log(originTimestamp, performance) {
    //****************************************
    // private variablesS
    var log = [];

    //****************************************
    // private functions
    /**
    * Adds an entry to the log array
    * @function add
    */
    function add(type, title, msg) {
        log.push({
            "timestamp": (originTimestamp + performance.now()) + ''
            , "type": type
            , "title": title
            , "message": typeof(msg) === 'string' && msg || JSON.stringify(msg)
        });
    }
    /**
    * Calculates the max length of each log value
    * @function
    */
    function calcSizes() {
        var sizes = [0, 0, 0, 0];
        log.forEach(function (val) { //eventually we might need to take a sample set rather than look at each one
            sizes[0] = val.timestamp.length > sizes[0] && val.timestamp.length || sizes[0];
            sizes[1] = val.type.length > sizes[1] && val.type.length || sizes[1];
            sizes[2] = val.title.length > sizes[2] && val.title.length || sizes[2];
            sizes[3] = val.message.length > sizes[3] && val.message.length || sizes[3];
        });
        return sizes;
    }
    /**
    * Pads the `val` to make it `size` in length
    * @function
    */
    function padValue(val, size) {
        return val + Array(size - val.length + 1).join(' ');
    }

    /**
    * @worker
    */
    return Object.create(null, {
        "add": {
            "enumerable": true
            , "value": add
        }
        , "extended": {
            "enumerable": true
            , "value": add.bind(null, 'extended')
        }
        , "info": {
            "enumerable": true
            , "value": add.bind(null, 'info')
        }
        , "metric": {
            "enumerable": true
            , "value": add.bind(null, 'metric')
        }
        , "warning": {
            "enumerable": true
            , "value": add.bind(null, 'warning')
        }
        , "error": {
            "enumerable": true
            , "value": function error(title, err) {
                if (!!err.message) {
                    add('error', title, err.message);
                    add('stack', title, err.stack);
                }
                else {
                    add('error', title, err);
                }
            }
        }
        , "entries": {
            "enumerable": true
            , "get": function () { return log; }
        }
        , "print": {
            "enumerable": true
            , "value": function (print) {
                var sizes = calcSizes();
                log.forEach(function (val) {
                    print(padValue(val.timestamp, sizes[0]) + '\t|\t' + padValue(val.type, sizes[1]) + '\t|\t' + padValue(val.title, sizes[2]) + '\t|\t' + padValue(val.message, sizes[3]));
                });
            }
        }
    });
};
