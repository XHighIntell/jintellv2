/**
    - Copy from jintellv1
    - Need to rewrite
 **/


var NODE_PATH = global.process.env["NODE_PATH"];

if (NODE_PATH == null) NODE_PATH = "C:\\node\\node_modules"
else NODE_PATH += ";C:\\node\\node_modules";

global.process.env["NODE_PATH"] = NODE_PATH;
require("module").Module._initPaths();


const FS = require('fs');
const Path = require('path');
const OS = require("os");
const intell = require('intell-node');
const colors = intell.colors;

!function() {
    globalThis.build = {};
    

    build.readAllFilesText = function(src) {
        if (Array.isArray(src) == false) src = [src];

        var code = '';

        src.forEach(function(value) {
            let text = FS.readFileSync(value, { encoding: "utf8" });
            if (text[0] == '\uFEFF') text = text.slice(1);

            if (code == "") code = text;
            else code += OS.EOL + text;
        });

        return code;
    }

    build.build = function(job, switches) {
        if (job.type == 'javascript') this.buildJavaScript(job, switches);
        else if (job.type == 'declaration typescript') this.buildDeclarationTypescript(job, switches);
        else if (job.type == 'style sheet') this.buildStyleSheet(job, switches);
        else throw "not support '" + job.type + "'type";
    }
    build.buildJavaScript = function(job, switches) {
        // 1. read files into string
        // 2. 

        // -- 1 --
        var src_files = (Array.isArray(job.src) == true ? job.src : [job.src]).map(function(value) { return Path.resolve(switches.input, value) });
        var code = build.readAllFilesText(src_files);


        if (switches.mode == "development") {
            var outputPath = Path.resolve(switches.output, job.dest.name);
            
            intell.IO.Directory.CreateDirectory(Path.dirname(outputPath));
            FS.writeFileSync(outputPath, code, { encoding: "utf8" });
        }
        else {
            const Babel = require("@babel/core");
            const Uglifyjs = require("uglify-js");



            var result = Babel.transform(code, {
                presets: [["@babel/preset-env", { "targets": "defaults", modules: false }]],
                sourceMaps: true,
                sourceFileName: Path.relative(Path.dirname(job.dest.sourcemap), job.dest.name),
            });


            // get relative path from minify to sourcemap
            var sourcemapUrl = Path.relative(Path.dirname(job.dest.minify), job.dest.sourcemap);

            var minify_result = Uglifyjs.minify(result.code, {
                output: {
                    comments: function(node, comment) {
                        return comment.value.indexOf('github.com') != -1;
                    }
                },
                sourceMap: {
                    content: result.map,
                    url: sourcemapUrl,
                }
            });


            if (minify_result.error) throw minify_result;

            var originalPath = Path.resolve(switches.output, job.dest.name);
            var minifyPath = Path.resolve(switches.output, job.dest.minify);
            var sourcemapPath = Path.resolve(switches.output, job.dest.sourcemap);

            intell.IO.Directory.CreateDirectory(Path.dirname(originalPath));
            intell.IO.Directory.CreateDirectory(Path.dirname(minifyPath));
            intell.IO.Directory.CreateDirectory(Path.dirname(sourcemapPath));

            FS.writeFileSync(originalPath, code, { encoding: "utf8" });
            FS.writeFileSync(minifyPath, minify_result.code, { encoding: "utf8" });
            FS.writeFileSync(sourcemapPath, minify_result.map, { encoding: "utf8" });
        }
    }
    build.buildDeclarationTypescript = function(job, switches) {

        // 1. read files into string
        // 2. create folders, write file

        // -- 1 --
        var src = (Array.isArray(job.src) == true ? job.src : [job.src]).map(function(value) { return Path.resolve(switches.input, value) });
        var code = build.readAllFilesText(src);
        var outputPath = Path.resolve(switches.output, job.dest.name);
        
        // -- 2 --
        intell.IO.Directory.CreateDirectory(Path.dirname(outputPath));
        FS.writeFileSync(outputPath, code, { encoding: "utf8" });

    }
    build.buildStyleSheet = function(job, switches) {
        // 1. read files into string
        // 2. create folders, write file

        // --1--
        var src = (Array.isArray(job.src) == true ? job.src : [job.src]).map(function(value) { return Path.resolve(switches.input, value) });
        var code = build.readAllFilesText(src);
        var outputPath = Path.resolve(switches.output, job.dest.name);

        // --2--
        intell.IO.Directory.CreateDirectory(Path.dirname(outputPath));
        FS.writeFileSync(outputPath, code, { encoding: "utf8" });
    }

    build.release = function(switches) {

        const axios = require("axios");
        const input = switches.input;
        const version = switches.version;
        const token = switches.token;
        

        var child_process = require('child_process');
        child_process.execSync('"C:/Program Files/7-Zip/7z.exe" a release.zip ' + input);

        // GITHUB_REPOSITORY: 'XHighIntell/github-actions-template'

        axios.post('https://api.github.com/repos/' + process.env.GITHUB_REPOSITORY + '/releases', {
            target_commitish: 'master',
            tag_name: version,
            name: version,
            body: 'Description of the release ' + version,
            draft: true,
            prerelease: false,
            generate_release_notes: false
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github+json',
                'Authorization': 'token ' + token,
            },
        }).then(function(e) {
            var id = e.data.id;
            var data = FS.readFileSync("release.zip");

            return axios.post('https://uploads.github.com/repos/' + process.env.GITHUB_REPOSITORY + '/releases/' + id + '/assets?name=release.zip', data, {
                headers: {
                    'Content-Type': 'application/zip',
                    'Accept': 'application/vnd.github+json',
                    'Authorization': 'token ' + token,
                },
            });

        }).catch(function(e) {
            console.log(e);

            throw e;
        });

        

    }
}()


/** @type build.BuildJob[] */
var jobs = [
    {
        type: 'javascript',
        name: 'intell.js',
        src: [
            'intell/intell.js',
            'intell/intell.ctrl.js',
            'intell/intell.ctrl.template.js',
            'intell.portal/portal.js',
            'intell.ctrl/ComboBox.js',
            'intell.ctrl/Numeric.js',
            'String.prototype.js',
        ],
        dest: {
            name: 'intell/intell.js',
            minify: 'intell/intell.min.js',
            sourcemap: 'intell/intell.min.js.map',
            comment: "/*! intell.js | https://github.com/XHighIntell/jintell */"
        }
    },
    {
        type: 'declaration typescript',
        name: 'intell.d.ts',
        src: [
            'intell/intell.d.ts',
            'intell/intell.ctrl.d.ts',
            'intell.portal/portal.d.ts',
            'intell.ctrl/ComboBox.d.ts',
            'intell.ctrl/Numeric.d.ts',
            'String.prototype.d.ts',
        ],
        dest: {
            name: 'intell/intell.d.ts'
        }
    },
    {
        type: "style sheet",
        name: "portal.css",
        src: [
            'intell.portal/portal.css',
        ],
        dest: {
            name: "intell/portal.css",
        }
    },
];

!function() {
    /** @type build.BuildArgumentsObject */
    var args = intell.Diagnostics.ParseArguments();
    var switches = args.switches;

    if (switches.action == 'build') {
        console.log("build target = '" + colors.fg(226) + args.switches.mode + colors.reset + "'");
        console.log("build output = '" + Path.resolve(args.switches.output) + "'");
        console.log();

        jobs.forEach(function(job, index) {

            process.stdout.write((index + 1).toString().padStart(2) + '. build ' + colors.fg(39) + job.name + colors.reset + '... ');
            var current_time = Date.now();

            build.build(job, switches);

            var elapsed = Date.now() - current_time;
            console.log("done in " + colors.fg(128) + elapsed + "ms" + colors.reset);
        });
    } else if (switches.action == 'release') {
        build.release(switches);
    }
}()





