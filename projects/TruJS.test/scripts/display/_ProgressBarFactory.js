/**
* An object factory for a ProgressBar
* @factory
*/
function _ProgressBarFactory(elementHelper, classHelper) {

  /**
  *
  * @function
  */
  function createProgressBar(target) {
      return elementHelper.create({
          "tag": 'div'
          , "target": target
          , "class": 'container'
          , "style": [

          ]
          , "children": [{
              "tag": 'h5'
              , "style": [
                  'text-align:center'
                  , 'height:32px'
                  , 'width:400px'
                  , 'position:absolute'
                  , 'top:50%'
                  , 'left:50%'
                  , 'margin-top:-52px'
                  , 'margin-left:-200px'
              ]
          }, {
              "tag": 'progress'
              , "class": 'bg-primary'
              , "style": [
                  'height:32px'
                  , 'width:200px'
                  , 'position:absolute'
                  , 'top:50%'
                  , 'left:50%'
                  , 'margin-top:-16px'
                  , 'margin-left:-100px'
              ]
              , "attributes": {
                  "max": 100
              }
          }]
      });
  };
  /**
  *
  * @function
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
  * @function
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
  return function ProgressBarFactory(cfg) {
      //********************************************************
      //private variables
      /**
      * The HTML Element that represents the progress bar
      * @property {object} el
      */
      var el = !!cfg && cfg.element
      /**
      * The HTMLElement that the grid will be appended to
      * @property {HTMLElement|string} target
      */
      , target = !!cfg && cfg.target
      ;

      //********************************************************
      //private functions

      //********************************************************
      //public methods and properties
      /**
      * @type ProgressBar
      */
      return Object.create(null, {
          /**
          * A function to show the progress bar
          * @method show
          */
          "show": {
              "enumerable": true
              , "value": function () {
                  //ensure the element has been created
                  if (!el) {
                      el = createProgressBar(target);
                  }
                  //show the element
                  showEl(el);
                  //return this for chaining
                  return this;
              }
          }
          /**
          * a function to update the progress bars title and/or value
          * @method update
          * @param {string} title The title shown above the progress bar
          * @param {number} percent The percentage done (0-100)
          */
          , "update": {
              "enumerable": true
              , "value": function (title, percent) {
                  if (!!el) {
                      if (!!title) {
                          el.children[0].innerText = title;
                      }
                      if (!isNill(percent)) {
                          el.children[1].value = percent;
                      }
                  }
                  return this;
              }
          }
          /**
          *
          * @method hide
          */
          , "hide": {
              "enumerable": true
              , "value": function () {
                  //hide the element
                  hideEl(el);
                  //return this for chaining
                  return this;
              }
          }
          /**
          *
          * @method destroy
          */
          , "destroy": {
              "enumerable": true
              , "value": function () {
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
};
