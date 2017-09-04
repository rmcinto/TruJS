TruJS.test.mock.mocked._MockXMLHttpRequest = (function (XMLHttpRequest, mock) {
    //return the mock of the element
    return mock(new XMLHttpRequest());
});
