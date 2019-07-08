/**
 * @array ABApplicationConfig
 *
 * This object is the primary source of properly configured ABApplication
 * entries.
 *
 *
 */
"use strict";

///// NOTE: remove this /* global */ once we are importing our AB* classes
/* global ABApplication ABObject ABObjectQuery ABDataCollection */

// import ABApplication from "./platform/ABApplication";
// import ABObject from "./platform/ABObject";
// import ABObjectQuery from "./platform/ABObjectQuery";
// import ABDataCollection from "./platform/views/ABViewDataCollection";

//import the applications
var allAppConfigs = [];

// import COACHING_CONFIG from '../app/applications/coaching2/config_app';
// allAppConfigs.push(COACHING_CONFIG);

var _AllApplications = [];
var _AllObjects = [];
var _AllQueries = [];
var _AllDCs = [];

var __ContainerApp = new ABApplication({});

//
// Open our AB Definitions, and import them as ABObjects
//
import ABDefinitions from "./ABDefinitions";

// create objects
ABDefinitions.objects.forEach((obj) => {
    _AllObjects.push(new ABObject(obj, __ContainerApp));
});
__ContainerApp._objects = _AllObjects;

// create Queries
ABDefinitions.queries.forEach((query) => {
    _AllQueries.push(new ABObjectQuery(query, __ContainerApp));
});
__ContainerApp._queries = _AllQueries;

// create Datacollections
ABDefinitions.dataCollections.forEach((dc) => {
    _AllDCs.push(new ABDataCollection(dc, __ContainerApp));
});
__ContainerApp._datacollections = _AllDCs;

//
// Now create new ABApplications with all the allAppConfigs
//
allAppConfigs.forEach((appConfig) => {
    var app = new ABApplication(appConfig);
    app._objects = _AllObjects;
    app._queries = _AllQueries;
    app._datacollections = _AllDCs;
    _AllApplications.push(app);
});

//
// finally, remap each object to point to it's orignial Application
// (if it is loaded)
//
_AllObjects.forEach((obj) => {
    var parentApp = _AllApplications.find((app) => {
        return app.id == obj.createdInAppID;
    });
    if (parentApp) {
        obj.application = parentApp;
    }
});

_AllQueries.forEach((obj) => {
    var parentApp = _AllApplications.find((app) => {
        return app.id == obj.createdInAppID;
    });
    if (parentApp) {
        obj.application = parentApp;
    }
});

// return them here:
export default {
    getApplication: function(ID) {
        return _AllApplications.find((app) => {
            return app.id == ID || app.name == ID;
        });
    },

    getDefault: function() {
        return __ContainerApp;
    }
};
