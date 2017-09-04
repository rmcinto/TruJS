/**
*
* @factory
*/
function _Reporter($self, log) {

    var entries = []
    , listener;

    /**
    * Executes the reporter listener if one exists
    * @function
    */
    function execListener(type, entry, indx, entries) {
        try {
            //fire the listener
            !!listener && listener(type, entry, indx, entries);
        }
        catch (ex) {
            log.error('_TestReporter.execListener', ex);
        }
    }

    /**
    * @worker
    */
    return Object.create($self, {
        "report": {
            "enumerable": true
            , "value": function (type, entry) {
                //capture the current length which will be the index of our new entry
                var indx = entries.length;

                //ensure we have the entry type in the entries object
                !entries[type] && (entries[type] = []);

                //add the entry
                entries[type].push(entry);

                //execute the listener
                execListener(type, entry, indx, entries);
            }
        }
        , "setListener": {
            "enumerable": true
            , "value": function (fn) {
                listener = fn;
            }
        }
        , "entries": {
            "enumerable": true
            , "value": function () {
                return entries;
            }
        }
    });
};
