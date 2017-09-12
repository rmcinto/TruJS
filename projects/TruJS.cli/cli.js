/**[@naming( { "skip": true })]*/
/**
* The command line file for the TruJS.cli module
* @module
*/
var cmdArgs = require('TruJS.cmdArgs') //get the command arguments object
, cli = require("TruJS.cli") //get the TruJS.cli ioc container
, processor = cli(".processor") //resolve the TruJS.cli._Processor
;

//add a handler for the reporter
cli(".reporter").addHandler(reportHandler);

//start the process
processor(cmdArgs)
  .then(function (results) {
    console.log("Finished");
    console.log(results);
  })
  .catch(function (err) {
    console.log(err);
  });

/**
* Handler function for the reporter
* @function
*/
function reportHandler(type, msg) {
  console[type](msg);
}
