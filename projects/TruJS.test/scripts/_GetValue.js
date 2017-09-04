/**
* Wraps a `value` and an optional `path` with a function that returns the value when called
* @factory
*/
function _GetValue($self, resolve) {

    //add the static method
    GetValue.isGetValue = isGetValue;

    //return the worker
    return GetValue;

    /**
    * @worker
    */
    function GetValue(value, path) {

        //set the prototype for type checking
        Object.setPrototypeOf(ReturnValue, $self);

        //return the wrapping function
        return ReturnValue;

        /**
        * Evaluates and returns the value
        * @function
        */
        function ReturnValue() {
            if (!!path) {
                return resolve(value, path);
            }
            else {
                return value;
            }
        };
    }
    /**
    * Tests the `obj` to see if it's a GetValue function
    * @function
    * @static
    */
    function isGetValue(obj) {
        return !isNill(obj) && Object.getPrototypeOf(obj) === $self;
    }
};
