/**[@naming({ "skip": true })]*/
//a simple script to get the querystring vals as a collection
var qs = location.search.substring(1), vals = {};
qs.split('&').forEach(function (val, indx, arr) {
    var nv = val.split('=');
    vals[nv[0]] = nv[1];
});

//create the progress bar
var progress =
    TruJSTest('.progressBar')({ target: 'body' })
    .show()
    .update('Starting', 0)
;

var testCount = TruJSTest('.testPackage').count, curTest, perc;


//setup the report listener
TruJSTest('.testReporter').setListener(function (type, entry) {
    //if this is a test then store the test
    if (type === 'end-test') {
        curTest = entry;
        perc = (curTest.index + 1) / testCount;
        perc = perc * 100;
    }
    else if (type === 'end-iteration') {
        progress.update((curTest.index + 1) + ':' + curTest.title + ' (' + (entry.iteration + 1) + ')', perc);
    }
    else if (type === 'finished') {
        progress.update('Finalizing', 100);
    }
});


//run the tests
TruJSTest('.testPackage')
    .resolve()
    .run({
        "iterations": vals['iterations'] || undefined
        , "testNums": !!vals['testNums'] && vals['testNums'].split(',') || undefined
        , "prime": vals['prime'] !== 'false'
    })
    .then(function (results) {
        //remove the progress bar
        progress.destroy();
        //display the results
        TruJSTest.resolveName('.resultGrid')
            ({ results: results, target: 'body' })
            .show();
    });
