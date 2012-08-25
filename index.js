var Canvas = require('canvas');

module.exports = function (src) {
    var lines = src.split('\n');
    var height = lines.length * 12;
    var width = Math.max.apply(null, lines.map(function (line) {
        return line.length;
    })) * 6;
    
    var canvas = new Canvas(width, height);
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgb(55,63,140)';
    
    lines.forEach(function (line, ix) {
        var chunks = line.split(/(\s{2,})/).filter(Boolean);
        var y = ix * 12;
        
        var col = 0;
        chunks.forEach(function (c) {
            if (!/\s{2,}/.test(c)) {
                var x = col * 6;
                var w = c.length * 6;
                ctx.fillRect(x, y, w, 12);
            }
            col += c.length;
        });
    });
    
    return canvas.createPNGStream();
};
