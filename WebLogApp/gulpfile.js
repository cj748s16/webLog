var gulp = require("gulp"),
    ts = require("gulp-typescript"),
    sourcemaps = require("gulp-sourcemaps"),
    less = require("gulp-less"),
    cssmin = require("gulp-cssmin"),
    rename = require("gulp-rename"),
    embedTemplates = require("gulp-angular-embed-templates"),
    del = require("del"),
    SystemBuilder = require("systemjs-builder"),
    CacheBust = require("gulp-cachebust"),
    fs = require("fs");

var cachebust = new CacheBust();

//eval("var project = " + fs.readFileSync("./project.json"));
var project = { webroot: "wwwroot" };
var lib = "./" + project.webroot + "/lib/";

var paths = {
    npm: "./node_modules/",
    bower: "./bower_components/",

    tsSourceBase: project.webroot + "/app/",
    tsSource: project.webroot + "/app/**/*.ts",
    tsSourceHtml: project.webroot + "/app/**/*.html",
    tsEntryPoint: project.webroot + "/temp/app/main.js",
    tsDef: project.webroot + "/definitions/app/",
    tsTemp: project.webroot + "/temp/app/",
    tsOutput: lib + "spa/",

    tsFwBase: project.webroot + "/framework/",
    tsFw: project.webroot + "/framework/**/*.ts",
    tsFwHtml: project.webroot + "/framework/**/*.html",
    tsFwEntryPoint: project.webroot + "/temp/framework/index.js",
    tsFwDef: project.webroot + "/definitions/framework/",
    tsFwTemp: project.webroot + "/temp/framework/",

    cssOutput: lib + "spa/css/",

    jsVendors: lib + "js",
    cssVendors: lib + "css",
    cssThemeVendors: lib + "css/themes",
    imgVendors: lib + "img",
    fontsVendors: lib + "fonts"
};

var tsFramework = ts.createProject(project.webroot + "/tsconfig.json");
var tsProject = ts.createProject(project.webroot + "/tsconfig.json");

gulp.task("setup-vendors", [], function () {
    // js
    gulp.src([
        //paths.npm + "@angular/**/*.umd*.js",
        paths.npm + "rxjs/**/*.js",
        paths.npm + "ng2-bs3-modal/**/*.js",
        paths.npm + "lodash/*.min.js",
        paths.npm + "crypto-js/*.js"
    ], { base: paths.npm })
        .pipe(gulp.dest(paths.jsVendors));

    gulp.src([
        paths.npm + "core-js/client/shim*.js",
        paths.npm + "zone.js/dist/zone.js",
        paths.npm + "reflect-metadata/Reflect*.js",
        paths.npm + "systemjs/dist/*.js",
        paths.npm + "jquery/dist/jquery.*js",
        paths.npm + "bootstrap/dist/js/bootstrap*.js",
        paths.npm + "bootstrap-material-design/dist/js/*.js",
        paths.npm + "fancybox/dist/js/jquery.fancybox.pack.js",
        paths.npm + "dateformat/lib/dateformat.js",
        paths.npm + "less/dist/less*.js"
    ]).pipe(gulp.dest(paths.jsVendors));

    gulp.src([
        paths.npm + "@angular/**/*.umd*.js"
    ], { base: paths.npm })
        .pipe(rename(function (path) {
            path.dirname = ".";
        }))
        .pipe(gulp.dest(paths.jsVendors + "/@angular"));

    gulp.src([
        paths.npm + "@ngx-translate/**/*.umd.js"
    ], { base: paths.npm })
        .pipe(rename(function (path) {
            path.dirname = ".";
        }))
        .pipe(gulp.dest(paths.jsVendors + "/@ngx-translate"));

    gulp.src([
        paths.npm + "localize-router/**/*.umd.js"
    ], { base: paths.npm })
        .pipe(rename(function (path) {
            path.dirname = ".";
        }))
        .pipe(gulp.dest(paths.jsVendors + "/localize-router"));

    gulp.src([
        paths.npm + "typescript/lib/*.js"
    ]).pipe(gulp.dest(paths.jsVendors + "/typescript"));

    gulp.src([
        paths.npm + "plugin-typescript/lib/plugin.js"
    ]).pipe(gulp.dest(paths.jsVendors));

    //gulp.src([
    //    paths.npm + "socket.io-client/dist/socket.io*.js"
    //]).pipe(gulp.dest(paths.jsVendors + "/socket.io-client"));

    gulp.src([
        paths.bower + "alertify-js/build/alertify.min.js"
    ]).pipe(gulp.dest(paths.jsVendors));

    gulp.src("systemjs.config*.js").pipe(gulp.dest(paths.jsVendors));

    // css
    gulp.src([
        paths.npm + "bootstrap/dist/css/bootstrap*.css",
        paths.npm + "bootstrap-material-design/dist/css/*.css",
        paths.npm + "fancybox/dist/css/jquery.fancybox.css"
    ]).pipe(gulp.dest(paths.cssVendors));

    gulp.src([
        paths.bower + "components-font-awesome/css/font-awesome.css",
        paths.bower + "alertify-js/build/css/alertify.css"
    ]).pipe(gulp.dest(paths.cssVendors));

    gulp.src([
        paths.bower + "alertify-js/build/css/themes/bootstrap.css",
        paths.bower + "alertify-js/build/css/themes/default.css"
    ]).pipe(gulp.dest(paths.cssThemeVendors));

    // images
    gulp.src([
        paths.npm + "fancybox/dist/img/blank.gif",
        paths.npm + "fancybox/dist/img/fancybox_loading.gif",
        paths.npm + "fancybox/dist/img/fancybox_loading@2x.gif",
        paths.npm + "fancybox/dist/img/fancybox_overlay.png",
        paths.npm + "fancybox/dist/img/fancybox_sprite.png",
        paths.npm + "fancybox/dist/img/fancybox_sprite@2x.png"
    ]).pipe(gulp.dest(paths.imgVendors));

    // fonts
    gulp.src([
        paths.npm + "bootstrap/fonts/glyphicons-halflings-regular.eot",
        paths.npm + "bootstrap/fonts/glyphicons-halflings-regular.svg",
        paths.npm + "bootstrap/fonts/glyphicons-halflings-regular.ttf",
        paths.npm + "bootstrap/fonts/glyphicons-halflings-regular.woff",
        paths.npm + "bootstrap/fonts/glyphicons-halflings-regular.woff2"
    ]).pipe(gulp.dest(paths.fontsVendors));

    gulp.src([
        paths.bower + "components-font-awesome/fonts/FontAwesome.otf",
        paths.bower + "components-font-awesome/fonts/fontawesome-webfont.eot",
        paths.bower + "components-font-awesome/fonts/fontawesome-webfont.svg",
        paths.bower + "components-font-awesome/fonts/fontawesome-webfont.ttf",
        paths.bower + "components-font-awesome/fonts/fontawesome-webfont.woff",
        paths.bower + "components-font-awesome/fonts/fontawesome-webfont.woff2"
    ]).pipe(gulp.dest(paths.fontsVendors));
});

gulp.task("clean", function (done) {
    return del([paths.tsOutput, paths.tsFwTemp, paths.tsTemp]);
});

gulp.task("build-css", ["clean"], function (done) {
    gulp.src(project.webroot + "/css/*.less")
        .pipe(sourcemaps.init())
        .pipe(less())
        //.pipe(cachebust.resources())
        .pipe(sourcemaps.write("./maps"))
        .pipe(cssmin())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest(paths.cssOutput))
        .on("end", done);
});

gulp.task("compile-ts", ["clean"], function (done) {
    var embedOpt = {
        sourceType: "ts",
        minimize: {
            dom: {
                xmlMode: true,
                lowerCaseAttributeNames: false,
                lowerCaseTags: false
            }
        }
    };
    var compileFw = function (cb) {
        var tsFwResult = gulp.src(paths.tsFw)
            .pipe(sourcemaps.init())
            .pipe(embedTemplates(embedOpt))
            .pipe(tsFramework());

        tsFwResult.js
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest(paths.tsFwTemp))
            .on("end", cb);
    };

    var compileApp = function (cb) {
        var tsResult = gulp.src(paths.tsSource)
            .pipe(sourcemaps.init())
            .pipe(embedTemplates(embedOpt))
            .pipe(tsProject());

        tsResult.js
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest(paths.tsTemp))
            .on("end", cb);
    };

    compileFw(() => compileApp(done));
});

gulp.task("build-js", ["compile-ts"], function (done) {
    var opt = {
        normalize: true,
        runtime: false,
        sourceMaps: false,
        minify: true,
        mangle: false
    };
    var meta = {
        "@angular/*": {
            build: false
        },
        "rxjs/*": {
            build: false
        },
        "dateformat": {
            build: false
        },
        "crypto-js/*": {
            build: false
        },
        "ng2-bs3-modal/*": {
            build: false
        },
        "@framework": {
            build: false
        }
    };
    var buildFw = function () {
        var builder = new SystemBuilder(paths.tsFwTemp);
        builder.config({
            paths: {
                "*": "*.js"
            },
            meta: meta
        });
        //return builder.bundle("index", paths.tsOutput + "framework.min.js", opt);
        return builder.buildStatic("index", paths.tsOutput + "framework.min.js", opt);
    };
    var buildApp = function () {
        var builder = new SystemBuilder(paths.tsTemp);
        builder.config({
            paths: {
                "*": "*.js"
            },
            meta: meta
        });
        return builder.buildStatic("main", paths.tsOutput + "app.min.js", opt);
    };

    if (buildFw()) {
        if (buildApp()) {
            done();
        }
    }
});

gulp.task("build", ["clean", "build-js", "build-css"]);

//gulp.task("watch.ts", ["compile-typescript"], function () {
//    return gulp.watch([paths.tsSource, paths.tsSourceHtml], ["compile-typescript"]);
//});

//gulp.task("watch.framework", ["compile-framework", "compile-typescript"], function () {
//    return gulp.watch(project.webroot + "/framework/**/*.ts", ["compile-framework", "compile-typescript"]);
//});

//gulp.task("watch.less", ["less"], function () {
//    return gulp.watch(project.webroot + "/css/*.less", ["less"]);
//});

gulp.task("watch.systemjs.config", ["setup-vendors"], function () {
    return gulp.watch("systemjs.config.*.js", ["setup-vendors"]);
});

//gulp.task("watch", ["watch.systemjs.config", "watch.framework", "watch.ts", "watch.less"]);

//gulp.task("build-spa", ["setup-vendors", "compile-framework", "compile-typescript", "less"]);