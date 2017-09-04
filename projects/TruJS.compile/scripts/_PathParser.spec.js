/**[@test( { "title": "TruJS.compile._PathParser: Test all special tags" } )]*/
function testPathParser(arrange, act, assert, callback, module) {
  var nodeDirname, nodeProcess, pathParser, base, path1, path2, path3, path4, path5, path6, res1, res2, res3, res4, res5, res6;

  arrange(function() {
    nodeDirname = "/dirname";
    nodeProcess = {
      "cwd": callback("/cwd")
    }
    pathParser = module(["TruJS.compile._PathParser", [, nodeProcess, nodeDirname]]);
    base = "/base/";
    path1 = "{script}/path1";
    path2 = "{root}/path2";
    path3 = "{repos}/path3";
    path4 = "{projects}/path4";
    path5 = "path5";
    path6 = "path6";
  });

  act(function() {
    res1 = pathParser(base, path1);
    res2 = pathParser(base, path2);
    res3 = pathParser(base, path3);
    res4 = pathParser(base, path4);
    res5 = pathParser(null, path5);
    res6 = pathParser(base, path6);
  });

  assert(function(test) {
    test("res1 should be").value(res1, "path").equals("\\dirname\\path1");
    test("res2 should be").value(res2, "path").equals("\\cwd\\path2");
    test("res3 should be").value(res3, "path").equals("\\cwd\\repos\\path3");
    test("res4 should be").value(res4, "path").equals("\\cwd\\projects\\path4");
    test("res5 should be").value(res5, "path").equals("\\cwd\\path5");
    test("res6 should be").value(res6, "path").equals("\\base\\path6");
  });
}
