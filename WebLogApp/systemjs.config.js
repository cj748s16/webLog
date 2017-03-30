(function (global) {

    // map tells the System loader where to look for things
    var map = {
        "app": "lib/spa/app.min.js",
        "@angular": "npm:@angular",
        "@ngx-translate": "npm:@ngx-translate",
        "localize-router": "npm:localize-router",
        "rxjs": "npm:rxjs",
        "ng2-bs3-modal": "npm:ng2-bs3-modal",

        // other libraries
        "dateformat": "npm:dateformat.js",
        "crypto-js": "npm:crypto-js",
        "@framework": "lib/spa/framework.min.js"
    };

    // packages tells the System loader how to load when no filename and/or no extension
    var packages = {
        "@angular": { defaultExtension: "umd.js" },
        "@ngx-translate": { defaultExtension: "umd.js" },
        "localize-router": { defaultExtension: "umd.js" },
        "rxjs": { defaultExtension: "js" },
        "ng2-bs3-modal": {
            main: "ng2-bs3-modal",
            defaultExtension: "js"
        },
        "crypto-js": {
            main: "index.js",
            defaultExtension: "js"
        }
    };

    var config = {
        paths: {
            // paths serve as alias
            "npm:": "lib/js/"
        },
        map: map,
        packages: packages
    };

    System.config(config);
})(this);