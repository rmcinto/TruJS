/**[@test( { "title": "TruJS.compile._Utilities.getLineEnding" } )]*/
function testUtilitiesGetLineEnding(arrange, act, assert, module) {
  var getLineEnding, CRLF = "\r\n", LF = "\n", data1, data2, res1, res2;

  arrange(function () {
    getLineEnding = module(["TruJS.compile._Utilities", []]).getLineEnding;
    data1 = "This is a test with a CR and LF\r\n";
    data2 = "This is a test with just a LF\n";
  });

  act(function () {
    res1 = getLineEnding(data1);
    res2 = getLineEnding(data2);
  });

  assert(function (test) {
    test("res1 should be CRLF").value(res1).equals(CRLF);
    test("res2 should be LF").value(res2).equals(LF)
  });
}

/**[@test( { "title": "TruJS.compile._Utilities.getScriptsDir" } )]*/
function testUtilitiesGetScriptsDir(arrange, act, assert, module) {
  var getScriptsDir, base, entry1, entry2, res1, res2;

  arrange(function () {
    getScriptsDir = module(["TruJS.compile._Utilities", []]).getScriptsDir;
    base = "/";
    entry1 = {};
    entry2 = { "scripts": "other" };
  });

  act(function () {
    res1 = getScriptsDir(base, entry1);
    res2 = getScriptsDir(base, entry2);
  });

  assert(function (test) {
    test("res1 should have the default \"scripts\" dir").value(res1).contains("scripts");
    test("res2 should have a \"other\" dir").value(res2).contains("other");
  });
}
