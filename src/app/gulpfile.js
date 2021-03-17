/* eslint-disable */
const { dest, parallel, src } = require("gulp");
const ts = require("gulp-typescript");
const { join } = require("path");

const inputs = {
    assets: join(__dirname, "../../assets/**/*"),
    html: join(__dirname, "**/*.html"),
    ts: join(__dirname, "**/*.ts")
};

const outDir = "dist/app";

const tsProject = ts.createProject(join(__dirname, "tsconfig.json"));

function copyAssets(done) {
    src(inputs.assets)
        .pipe(dest(join(outDir, "assets")));
    
    done();
}

function copyHtml(done) {
    src(inputs.html)
        .pipe(dest(outDir));

    done();
}

function buildTs(done) {    
    tsProject
        .src()
        .pipe(tsProject(ts.reporter.defaultReporter()))
        .js
        .pipe(dest(outDir));

    done();
}

// function bundleJs(done) {
//     browserify({
//             basedir: "./src",
//             debug: true,
//             entries: paths.ts,
//             cache: {},
//             packageCache: {},
//         })
//         .plugin(tsify)
//         .bundle()
//         .on('error', function(err) {
//             log(err.message);
//             this.emit('end');
//         })
//         .pipe(source("app.js"))
//         .pipe(dest(paths.dist));

//     done();
// }

module.exports = {
    inputs,

    build: parallel(
        copyAssets,
        copyHtml,
        buildTs
    ),
};