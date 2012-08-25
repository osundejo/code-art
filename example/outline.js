var collage = require('../');
var fs = require('fs');

var src = fs.readFileSync(__dirname + '/../index.js', 'utf8');
var ws = fs.createWriteStream(__dirname + '/out.png');
collage(src, {
    FunctionExpression : [ 'red', 'yellow', 'green', 'blue' ]
}).pipe(ws);
