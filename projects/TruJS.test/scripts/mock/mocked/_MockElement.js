TruJS.test.mock.mocked._MockElement = (function (createElement, mock) {
    //return the mock of the element
    return mock(
        createElement('div')
        , {
            "children": []
            , "appendChild": function (el) {
                this.children.push(el);
                el.parentElement = this;
            }
            , "insertBefore": function (child, before) {
                var index = this.children.indexOf(before);
                this.children.splice(index, 0, child);
                child.parentElement = this;
            }
        });
});
