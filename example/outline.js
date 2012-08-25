var collage = require('../');
var fs = require('fs');

var src = fs.readFileSync(__dirname + '/../index.js', 'utf8');
var ws = fs.createWriteStream(__dirname + '/out.png');
collage(src, {
    FunctionExpression : 'rgb(170,40,30)'
}).pipe(ws);
