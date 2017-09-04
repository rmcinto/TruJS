/**[@test({ "title": "TruJS.test.Package: unit test" })]*/
function testpackage(arrange, act, assert, callback, module) {
    var pkg, testResolver, testDependencies, testArray, test1, test2, setup1, setup2, tests;

    arrange(function () {
        testResolver = callback();
        testDependencies = {};
        testArray = [];

        pkg = module(['TruJS.test._Package', [testResolver, testDependencies, testArray]]);

        test1 = {
            "arrange": callback()
            , "act": callback()
            , "assert": callback()
        };
        test1.test = function (arrange, act, assert, setup1) {
            arrange(test1.arrange);
            arrange(test1.assert);
            arrange(test1.act);
        };

        test2 = function (arrange, act, assert, setup2) {

        };
        setup1 = {
            "asset": 'value'
        };
        setup2 = function (callback, setup1) {

        };
    });

    act(function () {
        pkg.setup('setup1').singleton(setup1);
        pkg.setup('setup2').factory(setup2);
        pkg.add('test1', test1);
        pkg.add('test2', test2);

        pkg.resolve();
    });

    assert(function (test) {
        test('The tests dependencies should have 2 properties').value(testDependencies).hasPropertyCountOf(2);
        test('The tests array should have 2 members').value(testArray).hasMemberCountOf(2);
        test('The testResolver should be called').value(testResolver).hasBeenCalled(1);
    });
}
