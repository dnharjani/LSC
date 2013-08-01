

require.config({
    // pathsオプションの設定。"module/name": "path"を指定します。拡張子（.js）は指定しません。
    paths: {
        "jquery": "jquery",
        "bootstrap": "bootstrap",
        "gmaps": "gmaps",
        "iscroll" : "iscroll",
        "knockout" : "knockout",
        "underscore" : "underscore",
        "backbone" : "backbone",
        "modernizr" : "modernizr",
        "bindings" : "bindings"
    },
    shim: {
        "bootstrap": {
            deps: ["jquery"]
        },

        "bindings" : {
            deps : ["underscore", "jquery", "gmaps", "iscroll", "knockout", "backbone", "bootstrap"]
        },

        "backbone": {
            "deps": ["underscore", "jquery"],
            // Exports the global window.Backbone object
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
    ["jquery", "knockout", "underscore", "iscroll", "gmaps", "bootstrap", "backbone", "bindings"]
);