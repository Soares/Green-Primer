function Point(x, y) {
    this.x = x || 0;
    this.y = y || 0;
    this.snapToGrid();
    return this;
};

Point.prototype.snapToGrid = function() {
    var snapped = layout.snap(this.x, this.y);
    this.x = snapped[0];
    this.y = snapped[1];
};
Point.prototype.move = function(point) {
    this.x = point.x;
    this.y = point.y;
    this.snapToGrid();
};
Point.prototype.shift = function(delta) {
    this.x += delta.x;
    this.y += delta.y;
    this.snapToGrid();
};
Point.prototype.copy = function() {
    return new Point(this.x, this.y);
};
