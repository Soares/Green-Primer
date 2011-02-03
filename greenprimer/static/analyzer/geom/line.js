var Line = function(start, end) {
    this.start = start;
    this.end = end;
    this.m = (this.start.y - this.end.y) / (this.start.x - this.end.x);
    this.b = (this.start.y) - (this.m * this.start.x);
    this.angle = Math.atan(this.m);
    if(this.angle < 0) this.angle += Math.PI;
};

Line.from = function(args) {
    var arg = args.length === 1? args[0] : false;
    if(arg instanceof Line) return arg;
    return new Line(args[0], args[1]);
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
    } else {
        var x = (line.b - this.b) / (this.m - line.m);
        var vector = new Vector(x, this.y(x));
    }
    return vector.liesOn(this) && vector.liesOn(line)? vector : false;
};
Line.prototype.angleBetween = function(line) {
    var theta;
    if(Math.abs(this.m) === Infinity) theta = 1 / line.m;
    else if(Math.abs(line.m) === Infinity) theta = 1 / this.m;
    else theta = (this.m - line.m) / (1 + (this.m * line.m));
    return geom.angle(Math.atan(Math.abs(theta)));
};
Line.prototype.normal = function() {
    return new Vector(1, -1/this.m).normalize();
};
