var Point = function(a, b) {
    this.set(a, b);
    return this;
};
Point.prototype.set = function(a, b) {
    var coords = util.coords(a, b);
    var snapped = layout.snap(coords[0], coords[1]);
    this.x = snapped[0];
    this.y = snapped[1];
    return this;
};
Point.prototype.sub = function(other) {
    return new Point(this.x - other.x, this.y - other.y);
};
Point.prototype.add = function(other) {
    return new Point(this.x + other.x, this.y + other.y);
};
Point.prototype.equals = function(other) {
    return this.x === other.x && this.y === other.y;
};
