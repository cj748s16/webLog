(function (global) {
    // map tells the System loader where to look for things
    var map = {
        "app": "app",

        // for transpiler
        "ts": "lib/js",
        "typescript": "npm:typescript",

        "@angular": "npm:@angular",
        "rxjs": "npm:rxjs",

        // other libraries
        "dateformat": "npm:dateformat.js",
        "ng2-bs3-modal": "npm:ng2-bs3-modal",
        //"socket.io": "npm:socket.io-client/socket.io.js",
        "crypto-js": "npm:crypto-js",
        "@framework": "framework"
    };
    //"angular-in-memory-web-api": "npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js",

    // packages tells the System loader how to load when no filename and/or no extension
    var packages = {
        "app": {
            main: "main",
            defaultExtension: "ts",
            meta: { "*.html": { loader: "text" } }
        },
        "@angular": { defaultExtension: "umd.js" },
        "rxjs": { defaultExtension: "js" },
        "ng2-bs3-modal": {
            main: "ng2-bs3-modal",
            defaultExtension: "js"
        },
        //"socket.io-client": {
        //    defaultExtension: "js"
        //},
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
    //"angular2-in-memory-web-api": {
    //    main: "index",
    //    defaultExtension: "js"
    //},

    //var ngPackagenames = [
    //    "core",
    //    "common",
    //    "compiler",
    //    "platform-browser",
    //    "platform-browser-dynamic",
    //    "http",
    //    "router",
    //    "forms",
    //    "upgrade"
    //];

    //ngPackagenames.forEach(function (pkgName) {
    //    packages["@angular/" + pkgName] = {
    //        main: `${pkgName}.umd.js`//, defaultExtension: "js"
    //    };
    //});

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