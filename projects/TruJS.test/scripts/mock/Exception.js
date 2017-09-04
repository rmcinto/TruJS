/**
* A wrapper to catch and store exceptions
* @worker
*/
function Exception() {

    /**
    * A array to store the exceptions
    * @property {array} exceptions
    */
    var exceptions = []
    ;

    /**
    *
    * @function wrap
    */
    function wrapper(func) {
        var exception = null;
        try {
            return func.apply(this, Array.prototype.slice.apply(arguments, 1));
        }
        catch (ex) {
            exception = ex;
        }
        finally {
            exceptions.push(exception);
        }
    };

    /**
    * Exception object
    */
    return Object.defineProperties(wrapper, {
        "isException": {
            "enumerable": true
            , "value": function (indx) {
                return exceptions[indx] !== null;
            }
        }
        , "getException": {
            "enumerable": true
            , "value": function (indx) {
                return exceptions[indx];
            }
        }
    });
};
