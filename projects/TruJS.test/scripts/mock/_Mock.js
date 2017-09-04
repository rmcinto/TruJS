/**
* This factory produces a worker function that is used to create a mock object
* producer.
* @factory
*/
function _Mock(mockCallback, stack, mockGetStack) {

    /**
    * Iterate through the target's properties
    * @function createMock
    */
    function createMock(target, config) {
        //this should be an object
        if (typeof (target) !== 'object') {
            throw new Error("The mock target must be an object.");
        }
        //create a properties object
        var props = Object.create(null)
        //create a container for the history, accessible as $mocked
        , mocked = Object.create(null), me
        ;
        //loop through all properties on the target and add a getter/setter as needed
        for (var key in target) {
            //if the type is a function
            //if (typeof (target[key]) === 'function') {
           //     mockFunction(props, key, config, mocked, target);
            //}
            //else {
                mockProperty(props, key, config, mocked, target);
           // }
        }
        //add the mocked property
        props["$mocked"] = {
            "enumerable": true
            , "get": function () { return mocked; }
        };

        //create and return an object with the props using the target as the prototype
        //we use the target as the prototype to preserve the type
        var me = Object.create(target, props);

        //if the target has a constructor then we'll need to mock that
        if (!!target.constructor && target.constructor !== Object) {
            return apply(
                me
                , mockCallback(
                    function () {
                        return me;
                    }, true)
                , { "$instance": me }
            );
        }

        return me;
    };
    /**
    * Mocks the property
    * @function mockProperty
    */
    function mockProperty(props, key, config, mocked, target) {
        var val = config[key] || target[key];
        //prime the mocked object
        mocked[key] = [];
        //if the type is an array
        if (isArray(val)) {
            config[key] = [];
        }
        //if the type is object and there isn't a config item for this prop create an empty object
        else if (typeof(val) === 'object' && !config.hasOwnProperty(key)) {
            config[key] = Object.create(null);
        }
        else if (typeof (val) === 'function') {
            config[key] = mockCallback(config[key], true);
            if (!!target[key].constructor) {
                config[key].constructor = config[key];
            }
        }
        else {
            config[key] = val;
        }
        mocked[key].value = config[key];
        //create a property
        props[key] = {
            "enumerable": true
            , "get": function () {
                //add a record to the mocked array
                mocked[key].push({
                    "action": 'get'
                    , "result": config[key]
                    , "stack": mockGetStack && stack()
                });
                //return the value
                return config[key];
            }
            , "set": function (newVal) {
                //add a record to the mocked array
                mocked[key].push({
                    "action": 'set'
                    , "result": newVal
                    , "stack": mockGetStack && stack()
                });
                //set the value
                config[key] = newVal;
                mocked[key].value = newVal;
            }
        };
    };
    /**
    * Mocks the function
    * @function mockFunction
    */
    function mockFunction(props, key, config, mocked, target) {
        //add a property that has a callback as the value
        //the callback should return the config value if exists
        //add the callback to the mocked collection so it can be inspected
        props[key] = {
            "value": mocked[key] = mockCallback(config[key] || target[key], true)
        };
    };

    /**
    * @producer
    * @param {object} target The object or prototype that will be used to create the mock object
    * @param {object} cfg The default configuration (can be overridden by the worker function execution.
    */
    return function Mock(target, cfg) {

        //throw an error if the target is missing
        if (!target) {
            throw new Error("The target object is missing");
        }

        /**
        * Creates an instance of the mocked object
        * @worker
        * @param {object|prototype} [config] The configuration for the mocked object. Overrides the factory configuration on a property by property basis
        */
        return function MockObject() {
            var config = apply(arguments[0], {}, cfg);
            //inspect the target and return the mock
            return createMock(target, config);
        };
    };
};
