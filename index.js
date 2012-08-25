var Canvas = require('canvas');
var falafel = require('falafel');

module.exports = function (src, opts) {
    if (!opts) opts = {};
    if (!opts.height) opts.height = 12;
    if (!opts.width) opts.width = 6;
    if (!opts.colors) opts.colors = {};
    
    var lines = src.split('\n');
    var height = lines.length * opts.height;
    var width = Math.max.apply(null, lines.map(function (line) {
        return line.length;
    })) * opts.width;
    
    var canvas = new Canvas(width, height);
    var ctx = canvas.getContext('2d');
    
    var rects = [];
    
    falafel(src, { loc : true }, function (node) {
        var color = typeof opts.colors === 'function'
            ? opts.colors(node)
            : opts.colors[node.type];
        ;
        if (!color) return;
        
        if (Array.isArray(color)) {
            var ix = 0;
            for (var p = node.parent; p; p = p.parent) {
                if (p.type === node.type) ix ++;
            }
            color = color[ix % color.length];
        }
        
        var start = node.loc.start;
        var end = node.loc.end;
        
        for (var i = start.line; i <= end.line; i++) {
            var s = i === start.line ? start.column : 0;
            var e = i === end.line ? end.column : undefined;
            rects.unshift({
                color : color,
                index : i - 1,
                start : s,
                end : e
            });
        }
    });
    
    rects.forEach(function (r) {
        ctx.fillStyle = r.color;
        
        var line = lines[r.index];
        var chunks = line.split(/(\s{2,})/).filter(Boolean);
        var y = r.index * opts.height;
        
        var col = r.start;
        chunks.forEach(function (c) {
            if (r.end !== undefined && col + c.length > r.end) return;
            
            if (!/\s{2,}/.test(c)) {
                var x = col * opts.width;
                var w = c.length * opts.width;
                ctx.fillRect(x, y, w, opts.height);
            }
            col += c.length;
        });
    });
    
    return canvas.createPNGStream();
};
