/* Yes, I know that this module shares a lot of code with vector. It's on
 * my list of things to refactor. This is basically a stripped down
 * vector that can only be used for integers and is always snapped
 * to the drawing grid. */
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
Point.prototype.equals = function(point) {
    return this.x === point.x && this.y === point.y;
};
Point.prototype.distanceFrom = function(point) {
    var dx = this.x - point.x, dy = this.y - point.y;
    return Math.sqrt((dx * dx) + (dy * dy));
};
Point.prototype.order = function(m, zero) {
    /* Hackery and magic */
    if(m === Infinity || m === -Infinity) return this.y - zero.y;
    return this.x - zero.x;
};

Point.prototype.inverse = function(point) {
    return new Point(-this.x, -this.y);
};

Point.prototype.minus = function(point) {
    return new Point(this.x - point.x, this.y - point.y);
};
Point.prototype.plus = function(point) {
    return new Point(this.x + point.x, this.y + point.y);
};
