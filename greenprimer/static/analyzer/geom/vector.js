/* This is a vector that can include floats and isn't snapped to the grid. Uses
 * include scrolling the screen around with the joystick and lots of distance/
 * direction calculations. */
function Vector(x, y) {
    this.x = x || 0;
    this.y = y || 0;
    return this;
};

/* Boolean Functions */
Vector.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};
Vector.prototype.equals = function(vector) {
    return this.x == vector.x && this.y == vector.y;
};

/* Generative Functions */
Vector.prototype.duplicate = function() {
    return new Vector(this.x, this.y);
};
Vector.prototype.plus = function(vector) {
    return new Vector(this.x + vector.x, this.y + vector.y);
};
Vector.prototype.minus = function(vector) {
    return new Vector(this.x - vector.x, this.y - vector.y);
};
Vector.prototype.times = function(vector) {
    return new Vector(this.x * vector.x, this.y * vector.y);
};

/* Movement Functions */
Vector.prototype.snap = function(a, b) {
    if(b === undefined) b = a;
    return new Vector(parseInt(this.x/a)*a, parseInt(this.y/b)*b);
};
Vector.prototype.distanceFrom = function(vector) {
    var dx = this.x - vector.x, dy = this.y - vector.y;
    return Math.sqrt((dx * dx) + (dy * dy));
};
Vector.prototype.shift = function(k) {
    return new Vector(this.x + k, this.y + k);
};

/* Mutative Functions */
Vector.prototype.snapToGrid = function() {
    var snapped = layout.snap(this.x, this.y);
    this.x = snapped[0];
    this.y = snapped[1];
};
Vector.prototype.set = function(other) {
    this.x = other.x;
    this.y = other.y;
};
Vector.prototype.add = function(other) {
    this.x += other.x;
    this.y += other.y;
};
Vector.prototype.subtract = function(other) {
    this.x -= other.x;
    this.y -= other.y;
};
Vector.prototype.multiply = function(other) {
    this.x *= other.x;
    this.y *= other.y;
};
Vector.prototype.divide = function(other) {
    this.x /= other.x;
    this.y /= other.y;
};
Vector.prototype.normalize = function() {
    var mag = this.length();
    this.x /= mag;
    this.y /= mag;
};
Vector.prototype.scale = function(k) {
    this.x *= k;
    this.y *= k;
};

/* Geometric Functions */
Vector.prototype.liesOn = function(line) {
    if(layout.neq(line.y(this.x), this.y)) return false;
    left = Math.min(line.start.x, line.end.x);
    right = Math.max(line.start.x, line.end.x);
    below = Math.min(line.start.y, line.end.y);
    above = Math.max(line.start.y, line.end.y);
    return this.x >= left && this.x <= right &&
           this.y >= below && this.y <= above;
};
Vector.prototype.rotate = function(theta) {
    this.normalize();
    var cos = Math.cos(theta), sin = Math.sin(theta);
    var x = (this.x * cos) - (this.y * sin);
    var y = (this.x * sin) + (this.y * cos);
    this.x = x;
    this.y = y;
};
