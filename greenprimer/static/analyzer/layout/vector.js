var Vector = function(a, b) {
    if(a instanceof Vector) return Vector(a.x, a.y);
    else if(b === undefined) return Vector(a.offsetX, a.offsetX);
    var snapped = layout.snap(a, b);
    this.x = snapped.x;
    this.y = snapped.y;
};
Vector.prototype.set = function(other) {
    this.x = other.x;
    this.y = other.y;
    return this;
};
Vector.prototype.sub = function(other) {
    return new Vector(this.x - other.x, this.y - other.y);
};
Vector.prototype.add = function(other) {
    return new Vector(this.x + other.x, this.y + other.y);
};
Vector.prototype.equals = function(other) {
    return this.x === other.x && this.y === other.y;
};
