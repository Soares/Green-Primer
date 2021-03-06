/* A stripped down geometrical line with just the stuff we need.
 * Inspired by sylvester, which is still in the code base (3rd party) but
 * ultimately was too complex for my needs and got removed. */
var Line = function(start, end) {
    this.start = start;
    this.end = end;
    this.m = (this.start.y - this.end.y) / (this.start.x - this.end.x);
    this.b = (this.start.y) - (this.m * this.start.x);
    this.angle = Math.atan(this.m);
    var dx = start.x - end.x;
    var dy = start.y - end.y;
    this.length = Math.sqrt((dx * dx) + (dy * dy));
    if(this.angle < 0) this.angle += Math.PI;
};

Line.prototype.y = function(x) { return (this.m * x) + this.b; };
Line.prototype.x = function(y) { return (this.y - this.b) / this.m; };
Line.prototype.intersection = function(line) {
    if(Math.abs(this.m) === Infinity && Math.abs(line.m === Infinity)) {
        var x = this.start.x;
        if(line.start.x != x) return false;
        if(line.end.y === this.start.y) return new Vector(x, this.start.y);
        if(line.end.y === this.end.y) return new Vector(x, this.end.y);
        return false;
    } else if(Math.abs(this.m) === Infinity) {
        var vector = new Vector(this.start.x, line.y(this.start.x));
    } else if(Math.abs(line.m) === Infinity) {
        var vector = new Vector(line.start.x, this.y(line.start.x));
    } else {
        var x = (line.b - this.b) / (this.m - line.m);
        var vector = new Vector(x, this.y(x));
    }
    return vector.liesOn(this) && vector.liesOn(line)? vector : false;
};
Line.prototype.normal = function() {
    var vector = new Vector(1, -1/this.m);
    vector.normalize();
    return vector;
};
