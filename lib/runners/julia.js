var shovel = require('../shovel'),
    config = require('../config'),
    codeWriteSync = require('../util').codeWriteSync,
    fs = require('fs'),
    temp = require('temp');

module.exports.run = function run(opts, cb) {
    temp.track();
    var juliaCodeDir = temp.mkdirSync('julia');
    shovel.start(opts, cb, {
        solutionOnly: function (run) {
            if (opts.setup) codeWriteSync('julia', opts.setup, juliaCodeDir);
            run({
                name: 'julia',
                args: ['-P', ['push!(LOAD_PATH, "', juliaCodeDir, '", "frameworks/julia")'].join(""),
                    '-e', opts.solution]
            });
        },
        testIntegration: function (run) {
            codeWriteSync('julia', opts.solution, juliaCodeDir);
            if (opts.setup) codeWriteSync('julia', opts.setup, juliaCodeDir);
            run({
                name: 'julia',
                args: ['-P', ['push!(LOAD_PATH, "', juliaCodeDir , '", "frameworks/julia")'].join(""), '-e', opts.fixture]
            });
        }
    });
};