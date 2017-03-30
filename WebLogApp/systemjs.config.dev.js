(function (global) {
    // map tells the System loader where to look for things
    var map = {
        "app": "app",

        // for transpiler
        "ts": "lib/js",
        "typescript": "npm:typescript",

        "@angular": "npm:@angular",
        "@ngx-translate": "npm:@ngx-translate",
        "localize-router": "npm:localize-router/localize-router.umd.js",
        "rxjs": "npm:rxjs",
        "ng2-bs3-modal": "npm:ng2-bs3-modal",

        // other libraries
        "dateformat": "npm:dateformat.js",
        "crypto-js": "npm:crypto-js",
        "@framework": "framework"
    };

    // packages tells the System loader how to load when no filename and/or no extension
    var packages = {
        "app": {
            main: "main",
            defaultExtension: "ts",
            meta: { "*.html": { loader: "text" } }
        },
        "@angular": { defaultExtension: "umd.js" },
        "@ngx-translate": { defaultExtension: "umd.js" },
        //"localize-router": { defaultExtension: "umd.js" },
        "rxjs": { defaultExtension: "js" },
        "ng2-bs3-modal": {
            main: "ng2-bs3-modal",
            defaultExtension: "js"
        },
        "crypto-js": {
            main: "index.js",
            defaultExtension: "js"
        },
        "@framework": {
            main: "index",
            defaultExtension: "ts"
        },
        "ts": { main: "plugin.js" },
        "typescript": {
            main: "typescript.js",
            meta: { "typescript.js": { exports: "ts" } }
        }
    };

    var config = {
        paths: {
            // paths serve as alias
            "npm:": "lib/js/"
        },
        map: map,
        packages: packages,
        transpiler: "ts",
        typescriptOptions: {
            tsconfig: true,
            sourceMap: true
        }
    };

    System.config(config);
})(this);