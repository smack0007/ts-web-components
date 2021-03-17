/* eslint-disable */
const { task, parallel, series, watch } = require("gulp");
const app = require("./src/app/gulpfile.js");

task("build", app.build);

task("watch", series("build", function() {
    // Make the paths relative and convert \ to /
    const filesToWatch = Object.values(app.inputs).map(x => x.replace(__dirname, ".").replaceAll("\\", "/"));
    
    console.info("Watching", filesToWatch);
    
    return watch(filesToWatch, series(
        (done) => {
            console.clear();
            done();
        },
        app.build
    ));
}));

task("default", parallel("build"));