/**[@test({ "title": "Test.mock.Callback: create a callback with a function response and autoRun true" })]*/
function testMockCallback1(arrange, act, assert, module) {
    var cb, resp;

    arrange(function () {
        resp = function () { return 'response'; };
        cb = module(['TruJS.test.mock._Callback', []])(resp, true);
    });

    act(function () {
        //run the callback without parameters
        cb();
        //run the callback with 1 parameter
        cb(1);
        //run the callback with 2 parameters
        cb('string', 100);
    });

    assert(function (test) {
        test('The callback should have been called 3 times').value(cb.callbackCount).equals(3);
        test('The first callback should have 0 arguments').value(cb.getArgCount(0)).equals(0);
        test('The second callback should have 1 arguments').value(cb.getArgCount(1)).equals(1);
        test('The third callback should have 2 arguments').value(cb.getArgs(2).length).equals(2);

        test('The third callbacks 1st arg should be "string"').value(cb.getArgs(2), '0').equals('string');
        test('The third callbacks 2nd arg should be 100').value(cb.getArgs(2), '1').equals(100);

        test('The response from the second callback should be "response"').value(cb.getResponse(1)).equals('response');
    });
}

/**[@test({ "title": "Test.mock.Callback: create a callback with a function response and autoRun false" })]*/
function testMockCallback2(arrange, act, assert, module) {
    var cb, resp;

    arrange(function () {
        resp = function () { return 'response'; };
        cb = module(['TruJS.test.mock._Callback',[]])(resp, false);
    });

    act(function () {
        //run the callback without parameters
        cb();
    });

    assert(function (test) {
        test('The response from the callback should be the function').value(cb.getResponse(0)).equals(resp);
    });
}
