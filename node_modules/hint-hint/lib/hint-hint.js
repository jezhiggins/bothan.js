var jshint  = require('jshint').JSHINT;
var glob    = require('glob');
var fs      = require('fs');
var async   = require('async');
var _       = require('lodash');

module.exports = function () {
    var paths  = [];
    var config = {};
    var tests  = 0;

    var colours = function (string, colour) {
        var colours = {
            red: '\033[31m',
            yellow: '\033[33m'
        };
        return colours[colour] + string + '\033[0;39m';
    };

    if (fs.existsSync(process.cwd() + '/.jshintrc')) {
        _.extend(config, JSON.parse(fs.readFileSync(process.cwd() + '/.jshintrc', 'utf-8')));
    }

    for (var arg in arguments) {
        if (typeof arguments[arg] === 'string') {
            paths.push(arguments[arg]);
        } else if (typeof arguments[arg] === 'object') {
            _.extend(config, arguments[arg]);
        }
    }

    var parseFile = function (file) {
        tests++;

        var test   = jshint(fs.readFileSync(file, 'utf-8'), config);
        var errors = jshint.data().errors;

        process.stdout.write(test ? 'ok ' : 'not ok ');
        process.stdout.write(tests + ' - ' + file + ' \n');

        if (errors) {
            process.stderr.write('# Failed JSHint: ' + colours(file, 'yellow') + '\n#\n');

            for (var i = 0; i < errors.length; i++) {
                var line = errors[i];

                var message = '# ' + colours(line.reason, 'red') +
                    colours(' At line ' + line.line + ':', 'yellow') + '\n#\n' +
                    '# ' + line.evidence + '\n#';
                for (var j = 0; j < line.character; j++) {
                    message += ' ';
                }
                message += '^\n#\n';

                process.stderr.write(message);
            }
        }        
    };

    async.each(paths, function (path, callback) {
        glob(path, function (err, files) {
            if (err) callback(err);

            files.forEach(parseFile);
            callback();
        });
    }, function (err) {
        if (err) return err;
        process.stdout.write('1..' + tests + '\n');
    });

};