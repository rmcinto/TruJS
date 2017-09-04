/**[@test({ "title": "Test.mock.mocked.MockElement" })]*/
function testMockElement(act, assert, callback, module) {
    var mock, el, createElement, mockEl;

    act(function () {
        el = {};
        createElement = callback(el);
        mock = callback(el);
        mockEl = module(['TruJS.test.mock.mocked._MockElement', [createElement, mock]]);
    });

    assert(function (test) {
        test('The createElement callback should have been called once').value(createElement).hasBeenCalled(1);
        test('The createElement callback should have one arg').value(createElement).hasBeenCalledWithArg(0, 0, 'div');

        test('The mock callback should have been called once').value(mock).hasBeenCalled(1);
        test('The mock callback should have 2 args').value(mock).hasArgCountOf(2);
        test('The mock callback first arg should be').value(mock).hasBeenCalledWithArg(0, 0, el);
        test('The mock callback second arg should have 2 props').value(mock.getArgs(0), '1').hasPropertyCountOf(3);
    });
}
