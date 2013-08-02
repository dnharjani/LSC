require.config({
    paths: {
        "jquery": "jquery",
        "bootstrap": "bootstrap",
        "gmaps": "gmaps",
        "iscroll" : "iscroll",
        "knockout" : "knockout",
        "underscore" : "underscore",
        "backbone" : "backbone",
        "modernizr" : "modernizr",
        "bindings" : "bindings",
        "bindingHandlers" : "bindingHandlers",
        "mapUtils" : "mapUtils",
        "serverUtilsJquery" : "serverUtilsJquery",
        "serverUtilsBackbone" : "serverUtilsBackbone"
    },
    shim: {
        "bootstrap": {
            deps: ["jquery"]
        },

        "bindings" : {
            deps : ["underscore", "jquery", "gmaps", "iscroll", "knockout", "serverUtilsJquery", "bootstrap", "mapUtils", "bindingHandlers"],
            exports : "appModel"
        },

        "bindingHandlers" : {
            deps : ["knockout"]
        },

        "backbone": {
            "deps": ["underscore", "jquery"],
            "exports": "Backbone"
        },

        underscore: {
            exports: '_'
        },

        gmaps: {
            exports: 'GMaps'
        },

        modernizr: {
            exports: 'Modernizr'
        }

    }
});

require(
    ["knockout", "bindings"],function(ko, appModel){
        appModel.initialize();
        ko.applyBindings(appModel);
    }
);