require.config({
    paths: {
        "jquery": "vendor/jquery",
        "bootstrap": "vendor/bootstrap",
        "gmaps": "vendor/gmaps",
        "iscroll" : "vendor/iscroll",
        "knockout" : "vendor/knockout",
        "underscore" : "vendor/underscore",
        "backbone" : "vendor/backbone",
        "modernizr" : "vendor/modernizr",

        "bindings" : "bindings",
        "bindingHandlers" : "utils/bindingHandlers",
        "mapUtils" : "utils/mapUtils",
        "serverUtilsJquery" : "utils/serverUtilsJquery",
        "serverUtilsBackbone" : "utils/serverUtilsBackbone"
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