/**
* This factory produces a worker function that extracts the routing annotations
* from each file, creates module enties for each route and app, adds the run
* factory file which implements the apps and routes, and then executes the
* module preProcessor.
* @factory
*/
function _RoutingPreProcessor(promise, preProcessor_module, type_route_server, annotation, namer, fileObj) {
  var cnsts = {
    "annotaionName": "route"
    , "defaultIndex": 999
    , "defaultType": "route"
  };

  /**
  * Extracts the annotaions from each file and returns an array of route
  * objects
  * @function
  */
  function getRoutes(resolve, reject, entry, files) {
    try {
      var routes = [];

      files.forEach(function forEachFile(fileObj) {
        var route = getRoute(entry, fileObj);
        if (!!route) {
          routes.push(route);
        }
      });

      resolve(routes);
    }
    catch(ex) {
      reject(ex);
    }
  }
  /**
  * Builds a route object for the fileObj
  * @function
  */
  function getRoute(entry, fileObj) {
    var route = annotation.lookup(cnsts.annotaionName, fileObj.data)
    , naming = namer(entry.root, fileObj);

    //only process if this has a route annotaion
    if (!!route) {
      //throw an error if we don't have a namespace + name
      if (!route.name && (!naming.namespace || !naming.name)) {
        throw new Error(errors.invalidNaming.replace("{path}", fileObj.path));
      }
      //set the factory name on the route object
      route.name = route.name || naming.name;
      //set the default type
      route.type = route.type || cnsts.defaultType;
    }
    return route;
  }
  /**
  * sorts the routes and apps using the index property
  * @function
  */
  function sortRoutes(resolve, reject, routes) {
    try {
      //seperate the routes and apps
      var apps = routes.filter(function filterApps(route) { return route.type === "app"; })
      , rts = routes.filter(function filterApps(route) { return route.type !== "app"; })
      ;
      //sort the apps
      apps.sort(sorter);
      //sorts the routes
      rts.sort(sorter);
      //recombine the apps and routes
      resolve(apps.concat(rts));
    }
    catch(ex) {
      reject(ex);
    }
  }
  /**
  * A sorter that uses the index property or the default index
  * @function
  */
  function sorter(a, b) {
    a.index = isNill(a.index) ? cnsts.defaultIndex : a.index;
    b.index = isNill(b.index) ? cnsts.defaultIndex : b.index;
    if (a.index < b.index) {
      return -1;
    }
    if (a.index > b.index) {
      return 1;
    }
    return 0;
  }
  /**
  * Adds the app and route entries to the module object
  * @function
  */
  function addRoutes(resolve, reject, entry, routes) {
    try {
      //add the $$server$$ entry to the module
      entry.module["$$server$$"] = entry.module["$$server$$"] || [{}];

      //get the $$server$$ object for easy adding
      var server = entry.module["$$server$$"][0]
      , appIndx = 0
      , routeIndx = 0
      ;
      //add the app and route properties
      server["apps"] = server["apps"] || [{}];
      server["routes"] = server["routes"] || [{}];

      //loop through the routes and update the server object
      routes.forEach(function forEachRoute(route) {
        if (route.type === "app") {
          server.apps[0]["app" + appIndx] = [route.name, [route]];
          appIndx++;
        }
        else {
          server.routes[0]["route" + routeIndx] = [route.name, [route]];
          routeIndx++;
        }
      });

      resolve();
    }
    catch(ex) {
      reject(ex);
    }
  }
  /**
  * Adds the server fileObj to the files array
  * @function
  */
  function addServerFile(resolve, reject, files) {
    try {
      var data = type_route_server.toString()
      , serverFileObj = fileObj("server.js", data)
      ;

      files.push(serverFileObj);

      resolve();
    }
    catch(ex) {
      reject(ex);
    }
  }

  /**
  * @worker
  */
  return function RoutingPreProcessor(entry, files) {

    //extract the routes from the files
    var proc = new promise(function (resolve, reject) {
      getRoutes(resolve, reject, entry, files);
    });

    //sort the route entries using the index property
    proc = proc.then(function (routes) {
      return new promise(function (resolve, reject) {
        sortRoutes(resolve, reject, routes);
      });
    });

    //create the route entries in the module object
    proc = proc.then(function (routes) {
      return new promise(function (resolve, reject) {
        addRoutes(resolve, reject, entry, routes);
      });
    });

    //add the server static file
    proc = proc.then(function () {
      return new promise(function (resolve, reject) {
        addServerFile(resolve, reject, files);
      });
    });

    //run the module preProcessor
    return proc.then(function () {
      return preProcessor_module(entry, files);
    });

  };
}