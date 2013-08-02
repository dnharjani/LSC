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
        "main" : "main"
    },
    shim: {
        "bootstrap": {
            deps: ["jquery"]
        },

        "bindings" : {
            deps : ["underscore", "jquery", "gmaps", "iscroll", "knockout", "backbone", "bootstrap"],
            exports : "appModel"
        },

        "main" : {
            deps : ["bindings", "knockout"]
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
    ["knockout", "bindings", "underscore", "iscroll", "gmaps", "bootstrap", "backbone", "jquery" ],function(ko, appModel){
        appModel.initialize();
        ko.applyBindings(appModel);
    }
);