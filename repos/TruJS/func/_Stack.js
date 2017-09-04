/**
* Causes an exception to get a stack trace and then parses the stack trace
* @factory
*/
function _Stack() {

    /**
    * A regex pattern to decode entries in the stack trace
    * @constant STACK_PATT
    */
    var STACK_PATT = /^\s+at\s(?:([^\(]+)\s\()?((?:https?:[^:]+)|native)(?::([0-9]+))?(?::([0-9]+))?\)?$/i;

    /**
    * @worker
    */
    return function Stack() {
        var stack, temp;
        //cause an error
        try {
            temp.fail = '';
        }
        catch (ex) {
            stack = ex.stack;
        }
        //split the stack trace by the new line char
        stack = stack.split('\n');
        //remove the top 2 entries
        stack.splice(0, 2);
        //create a stack object
        stack = stack.map(function (val) {
            //decode the stack trace entry
            val = STACK_PATT.exec(val);
            if (val != null) {
                //return the stack entry
                return {
                    "method": val[1]
                    , "file": val[2]
                    , "line": val[3]
                    , "col": val[4]
                };
            }
        });
        //return the stack trace array
        return stack;
    };
}
