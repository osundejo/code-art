var Canvas = require('canvas');
var falafel = require('falafel');

module.exports = function (src, colors) {
    if (!colors) colors = {};
    if (!colors.default) colors.default = 'rgb(55,63,140)';
    
    var lines = src.split('\n');
    var height = lines.length * 12;
    var width = Math.max.apply(null, lines.map(function (line) {
        return line.length;
    })) * 6;
    
    var canvas = new Canvas(width, height);
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = colors.default;
    
    lines.forEach(function (line, ix) {
        fillChunks(ix);
    });
    
    function fillChunks (ix, start, end) {
        var line = lines[ix];
        var chunks = line.split(/(\s{2,})/).filter(Boolean);
        var y = ix * 12;
        
        var col = start || 0;
        chunks.forEach(function (c) {
            if (end !== undefined && col + c.length > end) return;
            
            if (!/\s{2,}/.test(c)) {
                var x = col * 6;
                var w = c.length * 6;
                ctx.fillRect(x, y, w, 12);
            }
            col += c.length;
        });
    }
    
    falafel(src, { loc : true }, function (node) {
        if (colors[node.type]) {
            ctx.fillStyle = colors[node.type];
            
            var start = node.loc.start;
            var end = node.loc.end;
            
            for (var i = start.line; i <= end.line; i++) {
                if (i === start.line && i === end.line) {
                    fillChunks(i - 1, start.column, end.column);
                }
                else if (i === start.line) {
                    fillChunks(i - 1, start.column);
                }
                else if (i === end.line) {
                    fillChunks(i - 1, 0, end.column);
                }
                else {
                    fillChunks(i - 1);
                }
            }
        }
    });
    
    return canvas.createPNGStream();
};
