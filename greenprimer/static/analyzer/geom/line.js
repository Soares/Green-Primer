var Line = function(start, end) {
    this.start = start;
    this.end = end;
    this.m = (this.start.y - this.end.y) / (this.start.x - this.end.x);
    this.b = (this.start.y) - (this.m * this.start.x);
};

Line.from = function(args) {
    var arg = args.length === 1? args[0] : false;
    if(arg instanceof Line) return arg;
    return new Line(args[0], args[1]);
};

Line.prototype.y = function(x) { return (this.m * x) + this.b; };
Line.prototype.x = function(y) { return (this.y - this.b) / this.m; };
Line.prototype.intersection = function(line) {
    var x = (line.b - this.b) / (this.m - line.m);
    var vector = new Vector(x, this.y(x));
    return vector.liesOn(this) && vector.liesOn(line)? vector : false;
};
