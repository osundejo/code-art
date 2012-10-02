var Canvas = require('canvas');
var falafel = require('falafel');

module.exports = function art (src, opts) {
    if (!opts) opts = {};
    if (!opts.height) opts.height = 12;
    if (!opts.width) opts.width = 6;
    if (!opts.colors) opts.colors = {};
    if (!opts.left) opts.left = 0;
    
    if (Array.isArray(src)) {
        var size = src.slice(1).reduce(function (acc, s) {
            var size = imageSize(s, opts);
            return {
                width : acc.width + size.width + 50,
                height : Math.max(acc.height, size.height),
            };
        }, imageSize(src[0], opts));
        
        var canvas = new Canvas(size.width, size.height);
        
        var left = 0;
        src.forEach(function (s) {
            opts.left = left;
            draw(canvas, s, opts);
            
            var size = imageSize(s, opts);
            left += size.width + 50;
        });
        
        return canvas.createPNGStream();
    }
    else {
        var size = imageSize(src, opts);
        var canvas = new Canvas(size.width, size.height);
        draw(canvas, src, opts)
        return canvas.createPNGStream();
    }
};

function imageSize (src, opts) {
    var lines = src.split('\n');
    
    return {
        height : lines.length * opts.height,
        width : Math.max.apply(null, lines.map(function (line) {
            return line.length;
        })) * opts.width,
    };
}
    
function draw (canvas, src, opts) {
    var ctx = canvas.getContext('2d');
    var lines = src.split('\n');
    
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
                var x = opts.left + col * opts.width;
                var w = c.length * opts.width;
                ctx.fillRect(x, y, w, opts.height);
            }
            col += c.length;
        });
    });
};
