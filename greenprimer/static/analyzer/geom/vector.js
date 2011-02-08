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
Vector.prototype.distanceFrom = function(/* vector */) {
    var vector = Vector.from.apply(this, arguments);
    var dx = this.x - vector.x, dy = this.y - vector.y;
    return Math.sqrt((dx * dx) + (dy * dy));
};
Vector.prototype.shift = function(k) {
    return new Vector(this.x + k, this.y + k);
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
