# code-art

Create blocky modern art from code.

# example

``` js
var art = require('code-art');
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
```

![outline](http://substack.net/images/outline.png)

# methods

``` js
var art = require('code-art')
```

## art(src, opts)

`opts.colors` should be a function `fn(node)` that returns color strings or
arrays of colors or `opts.colors` can be an object that maps
[esprima](http://esprima.org/) node types to strings or arrays of colors.

When the resulting object lookup or function call for `opts.colors` is an array,
an element from the array will be selected based on how many parents of the node
share the same node type, modulo the length of the array.

`opts.width` is the width to use for each character, default 6.

`opts.height` is the height to use for each character, default 12.

If `src` is an Array, render each source item from left to right with
`opts.padding` of separation.

# install

With [npm](http://npmjs.org) do:

```
npm install code-art
```

# license

MIT
