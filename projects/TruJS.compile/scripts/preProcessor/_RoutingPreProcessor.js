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
    , "defaults": {
      "index": 999
      , "type": "route"
      , "appName": "app"
      , "method": "all"
      , "path": "/"
    }
    , "dependencies": {
      "nodeExpress": [":require(\"express\")"]
      , "nodeHttp": [":require(\"http\")"]
      , "nodeHttps": [":require(\"https\")"]
    }
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
      route.type = route.type || cnsts.defaults.type;
      route.method = route.method || cnsts.defaults.method;
      route.path = route.path || cnsts.defaults.path;
      //type specific defaults
      if (route.type === "app") {
        route.label = route.label || cnsts.defaults.appName;
        route.index = route.index || cnsts.defaults.index;
      }
    }
    //remove the ending .route from the name
    fileObj.name = fileObj.name.replace(".route", "");
    fileObj.file = fileObj.name + fileObj.ext;

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
      apps.sort(reverseSorter);
      //recombine the apps and routes
      resolve(apps.concat(rts));
    }
    catch(ex) {
      reject(ex);
    }
  }
  /**
  * A sorter that uses the index property to sort the array in reverse
  * @function
  */
  function reverseSorter(a, b) {
    if (a.index < b.index) {
      return 1;
    }
    if (a.index > b.index) {
      return -1;
    }
    return 0;
  }
  /**
  * Adds the app and route entries to the module object
  * @function
  */
  function updateModule(resolve, reject, entry, routes) {
    try {
      //add the $$server$$ entry to the module
      entry.module["$$server$$"] = entry.module["$$server$$"] || [{}];

      //get the $$server$$ object for easy adding
      var server = entry.module["$$server$$"][0]
      , apps = server["apps"] = (server["apps"] || [{}])
      , rtes = server["routes"] = (server["routes"] || [{}])
      , curApp
      , appIndx = 0
      , routeIndx = 0
      ;

      //loop through the routes and update the server object
      routes.forEach(function forEachRoute(route) {
        var routeList;

        //special processing for routes of type app
        if (route.type === "app") {
          //see if we need to add the app to the apps entry
          if(!apps[0].hasOwnProperty(route.label)) {
            apps[0][route.label] = { "label": route.label, "routes": {} };
          }
          //a reference to the app object
          curApp = apps[0][route.label];
          //a reference to the array of routes
          routeList = curApp.routes[route.path];
          //add the path entry to the routes object if missing
          if(!routeList) {
            routeList = curApp.routes[route.path] = [];
          }
          //add any routes to the route collection for this path
          if(!!route.routes) {
            //ensure the routes property is an array
            !isArray(route.routes) && (route.routes = route.routes.split(","));
            //loop through each route, only add a route if it hasn't been yet
            route.routes.forEach(function forEachRoute(route) {
              if (routeList.indexOf(route) === -1) {
                routeList.push(route);
              }
            });
          }
          //modify the label for the routes collection
          route.label = "appRoute" + appIndx;
          appIndx++;
          //insert the new label into the routes array, this is why we sorted in reverse
          routeList.splice(0, 0, route.label);
          //clear out the route path since the route will be added to the app with the path, we don't want the router to have a path also
          delete route.path;
        }

        //ensure we have a label
        if (!route.label) {
          route.label = "route" + routeIndx;
          routeIndx++;
        }

        //clean up the route object
        delete route.$index;
        delete route.$line;
        delete route.index;
        delete route.routes;

        //add the route entry
        rtes[0][route.label] = [{
          "factory": [route.name, []]
          , "meta": route
        }];

      });

      resolve();
    }
    catch(ex) {
      reject(ex);
    }
  }
  /**
  * Add the required dependencies for the routing
  * @function
  */
  function addDependencies(resolve, reject, entry) {
    try {
      applyIf(cnsts.dependencies, entry.module);
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
  function addServerFile(resolve, reject, entry, files) {
    try {
      //create the file
      var data = type_route_server.toString()
      , name = (entry.name || "TruJS") + ".routing._Server"
      , path = name.replace(/[.]/g, "/") + ".js"
      , serverFileObj = fileObj(path, data)
      ;

      files.push(serverFileObj);

      //add the module entry
      entry.module["serve"] = [name, []];

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
        updateModule(resolve, reject, entry, routes);
      });
    });

    //add the required dependencies
    proc = proc.then(function () {
      return new promise(function (resolve, reject) {
        return addDependencies(resolve, reject, entry);
      });
    });

    //add the server static file
    proc = proc.then(function () {
      return new promise(function (resolve, reject) {
        addServerFile(resolve, reject, entry, files);
      });
    });

    //run the module preProcessor
    return proc.then(function () {
      return preProcessor_module(entry, files);
    });
  };
}