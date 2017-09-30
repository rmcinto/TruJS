/**
* An object factory that creates a ResultGrid object
* @factory
*/
function _ResultGridFactory(elementHelper, classHelper, htmlEncoder) {

  /**
  *
  * @function createResultGrid
  */
  function createResultGrid(results, target) {
      //ensure we have test results
      if (!results) {
          throw new Error("There aren't any test results to show.");
      }
      //create the base container
      var el = elementHelper.create({
          "tag": 'div'
          , "target": target
          , "class": [
              'container'
              , 'hidden'
          ]
          , "style": [
              'background-color:#f9f9f9'
          ]
      });

      //create the summary
      createSummary(el, results);

      //create the results grid
      createGrid(el, results);

      //return the created element
      return el;
  };
  /**
  * Creates the header with the test count and failed count
  * @function createSummary
  */
  function createSummary(el, results) {
      //create the summary tags and append to el
      elementHelper.create({
          "tag": 'div'
          , "target": el
          , "class": ((!results.success) ? 'bg-danger' : 'bg-success')
          , "style": [
              'margin-bottom:10px'
              , 'padding:8px'
          ]
          , "children": [{
              "tag": 'h3'
              , "style": [
                  'margin:5px 10px 5px'
                  , 'display:flex'
              ]
              , "children": [{
                  "tag": 'span'
                  , "style": 'flex:1'
                  , "innerHTML": 'Testing Completed'
              }, {
                  "tag": 'small'
                  , "style": [
                      'text-align:right'
                      , 'display:flex'
                      , 'padding:4px'
                  ]
                  , "children": [{
                      "tag": 'div'
                      , "style": [
                          'width:24px'
                          , 'height:24px'
                          , 'margin-right:5px'
                      ]
                      , "class": 'gs-test-run'
                  }, {
                          "tag": 'div'
                      , "class": 'panel-title text-right'
                      , "style": [
                          'margin-right:10px'
                          , 'font-family: monospace'
                      ]
                      , "innerHTML": [
                          !!results.tests.length && results.tests[0].iterations.length
                      ]
                  }, {
                      "tag": 'div'
                      , "style": [
                          'width:24px'
                          , 'height:24px'
                          , 'margin-right:5px'
                      ]
                      , "class": 'gs-test'
                  }, {
                      "tag": 'div'
                      , "class": 'panel-title text-right'
                      , "style": [
                          'margin-right:10px'
                          , 'font-family: monospace'
                      ]
                      , "innerHTML": [
                          results.total
                      ]
                  }, {
                      "tag": 'div'
                      , "style": [
                          'width:24px'
                          , 'height:24px'
                          , 'margin-right:5px'
                      ]
                      , "class": 'gs-test-failed'
                  }, {
                      "tag": 'div'
                      , "class": 'panel-title text-right'
                      , "style": [
                          'font-family: monospace'
                      ]
                      , "innerHTML": [
                         results.failed
                      ]
                  }]
              }]
          }]
      });
  };
  /**
  * Creates the grid with the results from each test
  * @function createGrid
  */
  function createGrid(el, results) {
      //loop through the test
      for (var i = 0; i < results.tests.length; i++) {
          var test = results.tests[i]
          //create test panel and get the body portion
          , pnl = createTestPanel(el, test)
          ;
          pnl.test = test;
          //prim the panel if this is a failure
          if (!test.success) {
              toggleTestPanel.apply(pnl.children[0]);
          }
      }
  };
  /**
  * adds the iteration entries to the test panel body
  * @function addIterations
  */
  function addIterations(body, test) {
      //loop through the iterations
      for (var a = 0; a < test.iterations.length; a++) {
          //create an entry for this assert
          createIterationEntry(body, test.iterations[a]);
      }
  };
  /**
  * Creates the header for a test entry
  * @function createTestPanel
  */
  function createTestPanel(el, test) {
      return elementHelper.create({
          "tag": 'div'
          , "target": el
          , "class": 'panel panel-default' + (test.success && (!!test.assertions && ' panel-success' || ' panel-info') || ' panel-danger')
          , "style": [
              'overflow:hidden'
              , 'margin-bottom:10px'
              , 'height:34px'
          ]
          , "children": [{
              "tag": 'div'
              , "class": 'panel-heading'
              , "style": [
                  'display:flex'
                  , 'cursor:pointer'
                  , 'padding:4px'
              ]
              , "listeners": {
                  "click": toggleTestPanel
              }
              , "children": [{
                  "tag": 'div'
                  , "class": 'caret'
                  , "style": [
                      'margin:10px 15px 10px 5px'
                  ]
              }, {
                  "tag": 'div'
                  , "class": 'panel-title'
                  , "style": [
                      'flex: 20'
                      , 'line-height:24px'
                  ]
                  , "innerHTML": [
                      test.num
                      , ': '
                      , test.title
                  ]
              }, {
                  "tag": 'div'
                  , "style": [
                      'width:24px'
                      , 'height:24px'
                      , 'margin-right:5px'
                      , 'margin-left:10px'
                  ]
                  , "class": 'gs-test-time'
              }, {
                  "tag": 'div'
                  , "class": 'panel-title text-right'
                  , "style": [
                      'margin-right:10px'
                      , 'font-family: monospace'
                  ]
                  , "innerHTML": [
                      test.runtimes.act.toFixed(4)
                      , 'ms'
                  ]
              }, {
                  "tag": 'div'
                  , "style": [
                      'width:24px'
                      , 'height:24px'
                      , 'margin-right:5px'
                  ]
                  , "class": 'gs-test-assert'
              }, {
                  "tag": 'div'
                  , "class": 'panel-title text-right'
                  , "style": [
                      'margin-right:10px'
                      , 'font-family: monospace'
                  ]
                  , "innerHTML": [
                      test.assertions
                  ]
              }, {
                  "tag": 'div'
                  , "style": [
                      'width:24px'
                      , 'height:24px'
                      , 'margin-right:5px'
                  ]
                  , "class": 'gs-test-failed'
              }, {
                  "tag": 'div'
                  , "class": 'panel-title text-right'
                  , "style": [
                      'margin-right:10px'
                      , 'font-family: monospace'
                  ]
                  , "innerHTML": [
                      test.failed
                  ]
              }]
          }, {
              "tag": 'div'
              , "class": 'panel-body'
              , "style": [
                  'overflow:auto'
                  , 'padding:10px 0px 0px 10px'
                  , 'display:flex'
                  , 'flex-wrap:wrap'
                  , 'align-content:stretch'
              ]
          }]
      });
  };
  /**
  * Toggles the test panel open or closed
  * @function toggleTestPanel
  */
  function toggleTestPanel() {
      var pnl = this.parentElement
      , test = pnl.test
      , body = pnl.children[1]
      ;
      //set the panel toggle
      pnl.open = !pnl.open;
      //if the panel is open
      if (!!pnl.open) {
          // if there was an exception show that
          if (!!test.exception) {
              createErrorEntry(body, test.exception);
          }
          else {
              addIterations(body, test);
          }
      }
      else {
          body.innerHTML = '';
      }
      classHelper.toggle(pnl, 'dropup');
      pnl.style.height = !pnl.style.height && '34px' || null;
  };
  /**
  * Creates an entry for the test assert
  * @function createTestAssertEntry
  */
  function createIterationEntry(el, iteration) {
      //each iteration gets a tile
      elementHelper.create({
          "tag": 'div'
          , "target": el
          , "class": [
              'panel'
              , 'panel-default'
          ]
          , "style": [
              'padding:10px 10px 0px 10px'
              , 'display:inline-block'
              , 'margin:0px 10px 10px 0px'
              , 'flex:1'
          ]
          , "children": [{
              "tag": 'div'
              , "style": [
                  'padding-bottom:10px'
                  , 'display:flex'
              ]
              , "children": [{
                  "tag": 'div'
                  , "style": [
                      'display:inline-block'
                      , 'white-space: nowrap'
                  ]
                  , "innerHTML": [
                      '<b>Iteration #'
                      , iteration.num
                      , '</b> ('
                      , iteration.runtimes.act.toFixed(4)
                      , 'ms)'
                  ]
              }]
          }, {
              "tag": 'div'
              , "children": createAssertEntries(iteration)
          }]
      });
  };
  /**
  * Creates an entry for the iterations assert
  * @function createAssertEntries
  */
  function createAssertEntries(iteration) {
      var entries = [];

      //add the assert entries
      for (var i = 0; i < iteration.assertions.length; i++) {
          var assert = iteration.assertions[i];
          //push the entry
          entries.push({
              "tag": 'div'
              , "style": [
                  'padding-bottom:10px'
              ]
              , "children": [{
                  "tag": 'div'
                  , "class": 'gs-test-assert-icon-' + ((assert.pass) ? 'passed' : 'failed')
                  , "style": [
                      'height:18px'
                  ]
                  , "children": [{
                      "tag": 'span'
                      , "style": [
                          'margin-left:28px'
                          , 'white-space:pre'
                          , 'font-weight:bold'
                      ]
                      , "innerHTML": [
                          assert.title
                      ]
                  }]
              }, {
                  "tag": 'div'
                  , "style": [
                      'margin-left:28px'
                  ]
                  , "innerHTML": [
                      assert.name
                      , '('
                      , assert.args.map(massageArg).join(', ')
                      , ')'
                      , !!assert.exception && ('<br/><br/>** ' + assert.exception.stack) || ''
                  ]
              }]

          });
      }

      //return the entries
      return entries;
  };
  /**
  *
  * @function massageArg
  */
  function massageArg(arg) {
      var val = arg;
      //if val has a tostring method then run it
      val = !isNill(val) && !!val.toString && val.toString() || Object.prototype.toString.apply(val);
      //if the result is a string
      if (typeof (val) === 'string') {
          val = '"' + val + '"';
      }
      switch (val) {
          case 0:
              val = '0';
              break;
          case null:
              val = '"null"';
              break;
          case undefined:
              val = '"undefined"';
              break;
      }
      //reduce the size of the val
      if (val.length > 40) {
          val = val.substring(0, 37) + '...';
      }
      //return the html encoded value
      return htmlEncoder.encode(val);
  };
  /**
  * Creates an entry for the test iteration
  * @function createErrorEntry
  */
  function createErrorEntry(el, exception) {
      elementHelper.create({
          "tag": 'div'
          , "target": el
          , "class": 'bg-warning'
          , "style": [
              'border:1px dashed red'
              , 'margin:0px 10px 10px 0px'
              , 'padding:5px'
              , 'flex:1'
          ]
          , "children": [{
              "tag": 'div'
              , "innerHTML": exception
          }, {
              "tag": 'div'
              , "innerHTML": exception.stack
          }]
      });
  };
  /**
  *
  * @function showEl
  */
  function showEl(el) {
      //set the show class
      classHelper
          .remove(el, 'hidden')
          .add(el, 'show')
      ;
  };
  /**
  *
  * @function hideEl
  */
  function hideEl(el) {
      //only need to hide if the element exists
      if (!!el) {
          classHelper
              .remove(el, 'show')
              .add(el, 'hidden')
          ;
      }
  };

  /**
  * @worker
  * @param {object} cfg The configuration object
  */
  return function ResultGridFactory(cfg) {
      //**********************************************
      // private variables
      /**
      * The HTML Element that represents the grid
      * @property {object} el
      */
      var el = !!cfg && cfg.element
      /**
      * The HTMLElement that the grid will be appended to
      * @property {HTMLElement|string} target
      */
      , target = !!cfg && cfg.target
      /**
      *
      * @property {HTMLElement|string} target
      */
      , results = !!cfg && cfg.results
      ;

      //**********************************************
      // public methods and properties
      /**
      * @type ResultGrid
      */
      return Object.create(null, {
          /**
          * Displays the result grid element. Must be called as a method for chaining.
          * @method show
          * @param {object} results The test results to display
          */
          "show": {
              "enumerable": true
              , "value": function show() {
                  //ensure the element has been created
                  if (!el) {
                      el = createResultGrid(results, target);
                  }
                  //show the element
                  showEl(el);
                  //return this for chaining
                  return this;
              }
          }
          /**
          * Hides the result grid element. Must be called as a method for chaining.
          * @method hide
          */
          , "hide": {
              "enumerable": true
              , "value": function hide() {
                  //hide the element
                  hideEl(el);
                  //return this for chaining
                  return this;
              }
          }
          /**
          * Deletes the ResultGrid element. Must be called as a method for chaining.
          * @method destroy
          */
          , "destroy": {
              "enumerable": true
              , "value": function destroy() {
                  //if the element exists and has a parent
                  //remove it from the parent
                  if (!!el && !!el.parentElement) {
                      el.parentElement.removeChild(el);
                  }
                  //remove the reference
                  el = null;
                  //return this for chaining
                  return this;
              }
          }
      });
  }
}
