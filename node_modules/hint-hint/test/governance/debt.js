var test    = require('tap').test;
var bux     = require('codebux');

bux(__dirname + '/../../lib/hint-hint.js', function (err, obj) {
    test('debt', function (t) {
        t.equal(err, null, 'Errors should be null');
        t.type(obj, 'number', 'Results should be a number');
        t.ok(obj > 90, 'Remaining bux should be greater than 90');
        t.end();
    });
});