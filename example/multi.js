var art = require('../');
var fs = require('fs');

var sources = [ 'a.js', 'b.js', 'c.js' ].map(function (x) {
    return fs.readFileSync(__dirname + '/multi/' + x, 'utf8');
});

var colors = {
    FunctionExpression : [
        'rgb(240,240,40)', 'rgb(40,240,40)', 'rgb(40,40,240)', 'rgb(240,40,40)'
    ],
    Program : 'rgb(240,40,40)'
};

var ws = fs.createWriteStream(__dirname + '/multi.png');
art(sources, { colors : colors, height : 4, width: 2 }) .pipe(ws);
