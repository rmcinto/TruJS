/**[@test({ "title": "TruJS.compile._PathResultProcessor: file, directory, missing, minus" })]*/
function testPathResultProcessor1(arrange, act, assert, module) {
  var pathResultProcessor, files, pathResults;

  arrange(function () {
    pathResultProcessor = module(["TruJS.compile._PathResultProcessor", []]);
    files = [{
      "path": "/base/path/file.js"
    }];
    pathResults = [
      "/base/path/file.js"
      , "/base/path/file1.js"
      , "/base/path2/file5.html" //minused below
      , {
        "fragment": "path"
        , "path": "/base"
        , "files": [
          "/base/path/file1.js" //duplicate
          , "/base/path/file2.js"
          , "/base/path/file3.js" //minused below
          , "/base/path/file4.html"
          , "/base/path/path2/path3/file6.html" //not recursive
        ]
      }, {
        "missing": true
        , "path": "/base/path/missing.js"
      }, {
        "minus": true
        , "path": "/base/path/file3.js"
      }, {
        "minus": true
        , "path": "/base"
        , "fragment": "path2"
        , "wildcard": "*.html"
      }
    ];

  });

  act(function () {
    pathResults.forEach(function (result) {
      files = pathResultProcessor(files, result);
    });
  });

  assert(function (test) {

    test("There should be 5 files")
      .value(files)
      .hasMemberCountOf(5);
    test("The files should be unique")
      .value(files)
      .isUnique();

  });
}

/**[@test({ "title": "TruJS.compile._PathResultProcessor: directory with recursive" })]*/
function testPathResultProcessor2(arrange, act, assert, module) {
  var pathResultProcessor, files, pathResults;

  arrange(function () {
    pathResultProcessor = module(["TruJS.compile._PathResultProcessor", []]);
    files = [{
      "path": "/base/path/file.js"
    }];
    pathResults = [
      "/base/path/file.js"
      , "/base/path/file1.js"
      , {
        "options": {
          "recurse": true
        }
        , "files": [
          "/base/path/file1.js"
          , "/base/path/file2.js"
          , "/base/path/file3.js"
          , "/base/path/file4.html"
          , "/base/path2/file5.html"
          , "/base/path/path2/path3/file6.html"
        ]
      }, {
        "missing": true
        , "path": "/base/path/missing.js"
      }, {
        "minus": true
        , "path": "/base/path/file3.js"
      }, {
        "minus": true
        , "path": "/base"
        , "fragment": "path2"
        , "wildcard": "*.html"
      }
    ];

  });

  act(function () {
    pathResults.forEach(function (result) {
      files = pathResultProcessor(files, result);
    });
  });

  assert(function (test) {

    test("There should be 6 files")
      .value(files)
      .hasMemberCountOf(6);
    test("The files should be unique")
      .value(files)
      .isUnique();

  });
}
