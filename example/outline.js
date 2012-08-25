var art = require('../');
var fs = require('fs');

var src = fs.readFileSync(__dirname + '/../index.js', 'utf8');
var ws = fs.createWriteStream(__dirname + '/outline.png');

var colors = {
    FunctionExpression : [
        'rgb(240,240,40)', 'rgb(40,240,40)', 'rgb(40,40,240)', 'rgb(240,40,40)'
    ],
    Program : 'rgb(240,40,40)'
};

art(src, { colors : colors, height : 4, width: 2 }) .pipe(ws);
