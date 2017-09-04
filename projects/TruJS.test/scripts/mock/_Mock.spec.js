/**[@test({ "title": "Test.mock.Mock: mock and object using a configuration" })]*/
function testMockMock1(arrange, act, assert, callback, module) {
    var obj, cfg, mock, stack;

    arrange(function () {
        obj = {
            "name": 'obj name'
            , "age": 10
            , "email": 'obj@email.com'
            , "address": {
                "street": 'obj street'
            }
            , "getAge": function () { }
            , "getAddress": function () { }
        };
        cfg = {
            "name": 'new name'
            , "address": {
                "street": 'new street'
            }
            , "getAddress": function () { }
        };
        stack = callback();
    });

    act(function () {
        //create the mock factory and generate a mock object
        mock = module(['TruJS.test.mock._Mock', [callback, stack, true]])(obj, cfg)();
    });

    assert(function (test) {
        test('The mock name should be the cfg.name').value(mock.name).equals(cfg.name);
        test('The mock address should be the cfg.address').value(mock.address).equals(cfg.address);

        test('The mock getAge should not be the obj.getAge').value(mock.getAge).not().equals(obj.getAge);
    });
}

/**[@test({ "title": "Test.mock.Mock: pass a config to the worker" })]*/
function testMockMock2(arrange, act, assert, callback, module) {
    var obj, factoryCfg, workerCfg, mock;

    arrange(function () {
        obj = {
            "name": 'obj name'
            , "age": 10
            , "email": 'old@email.com'
            , "address": {
                "street": 'obj street'
            }
            , "getAge": function () { console.log('obj getAge'); }
            , "getAddress": function () { console.log('obj agetAddress'); }
        };
        factoryCfg = {
            "name": 'factory name'
            , "address": {
                "street": 'factory street'
            }
            , "getAge": function () { console.log('factory getAge'); }
            , "getAddress": function () { console.log('factory agetAddress'); }
        };
        workerCfg = {
            "name": 'worker name'
            , "address": {
                "street": 'worker street'
            }
            , "getAddress": function () { console.log('worker agetAddress'); }
        };
    });

    act(function () {
        //create the mock factory and generate a mock object
        mock = module(['TruJS.test.mock._Mock', [callback]])(obj, factoryCfg)(workerCfg);
    });

    assert(function (test) {
        test('The mock name should be the workerCfg.name').value(mock.name).equals(workerCfg.name);
        test('The mock address should be the workerCfg.address').value(mock.address).equals(workerCfg.address);
    });
}
