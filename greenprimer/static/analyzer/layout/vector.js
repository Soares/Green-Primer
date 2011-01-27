// Inspired by James Coglan's Sylvester. Heavily modified by Nate Soares

function Vector(x, y) {
    this.x = x || 0;
    this.y = y || 0;
    return this;
};

Vector.prototype.set = function() {
    var coords = util.coords(a, b);
    var snapped = layout.snap(coords[0], coords[1]);
    this.x = snapped[0];
    this.y = snapped[1];
    return this;
};

// Make sure that the arguments are a vector
Vector.from = function(args) {
    var arg = args.length === 1? args[0] : false;
    if(arg instanceof Vector) return arg;
    if($.isArray(arg)) return Vector.fromArray(arg);
    if(arg) return Vector.fromEvent(arg);
    return new Vector(args[0], args[1]);
};
Vector.fromArray = function(array) {
    return new Vector(array[0], array[1]);
};
Vector.fromEvent = function(e) {
    var coords = utils.eventCoords(e);
    return new Vector(coords[0] + gp.view.scrollLeft(),
                      coords[1] + gp.view.scrollTop());
};

Vector.prototype.snapToGrid = function() {
    var snapped = layout.snap(this.x, this.y);
    this.x = snapped[0];
    this.y = snapped[1];
    return this;
};
Vector.prototype.length = function() {
    return Math.sqrt(this.dot(this));
};
Vector.prototype.equals = function(/* vector */) {
    var vector = Vector.from(arguments);
    return this.x == vector.x && this.y == vector.y;
};
Vector.prototype.copy = function() {
    return new Vector(this.x, this.y);
};
Vector.prototype.map = function(fn) {
    return new Vector(fn(this.x), fn(this.y));
};
Vector.prototype.unit = function() {
    var d = this.length();
    if(d === 0) return this.copy();
    return this.map(function(i) { return i / d; });
};
Vector.prototype.angleFrom = function(/* vector */) {
    vector = Vector.from(arguments);
    var a = this.length(), b = vector.length(), c = this.dot(vector);
    if(a * b === 0) return null;
    var theta = c / (a * b);
    return Math.acos(Math.min(1, Math.max(-1, theta)));
};
Vector.prototype.isParallelTo = function(/* vector */) {
    vector = Vector.from(arguments);
    var angle = this.angleFrom(vector);
    if(angle === null) return null;
    return layout.isZero(angle);
};
Vector.prototype.isAntiparallelTo = function(/* vector */) {
    vector = Vector.from(arguments);
    var angle = this.angleFrom(vector);
    if(angle === null) return null;
    return layout.isZero(angle - Math.PI);
};
Vector.prototype.isPerpindicularTo = function(/* vector */) {
    vector = Vector.from(arguments);
    var dot = this.dot(vector);
    if(dot === null) return null;
    return layout.isZero(Math.abs(dot));
};
Vector.prototype.plus = function(/* vector */) {
    vector = Vector.from(arguments);
    return new Vector(this.x + vector.x, this.y + vector.y);
};
Vector.prototype.minus = function(/* vector */) {
    vector = Vector.from(arguments);
    return new Vector(this.x - vector.x, this.y - vector.y);
};
Vector.prototype.multiply = function(/* vector */) {
    vector = Vector.from(arguments);
    return new Vector(this.x * vector.x, this.y * vector.y);
};
Vector.prototype.scale = function(k) {
    return new Vector(this.x * k, this.y * k);
};
Vector.prototype.shift = function(k) {
    return new Vector(this.x + k, this.y + k);
};
Vector.prototype.dot = function(/* vector */) {
    vector = Vector.from(arguments);
    return (this.x * vector.x) + (this.y * vector.y);
};
Vector.prototype.round = function(/* vector */) {
    return this.map(function(i) { return Math.round(i); });
};
Vector.prototype.snap = function(a, b) {
    if(b === undefined) b = a;
    return new Vector(parseInt(this.x/a)*a, parseInt(this.y/b)*b);
};
Vector.prototype.distanceFrom = function(/* vector */) {
    vector = Vector.from(arguments);
    var dx = this.x - vector.x, dy = this.y - vector.y;
    return Math.sqrt((dx * dx) + (dy * dy));
};
Vector.prototype.liesOn = function(line) {
    line = Line.from(arguments);
    if(layout.neq(line.y(this.x), this.y)) return false;
    left = Math.min(line.start.x, line.end.x);
    right = Math.max(line.start.x, line.end.x);
    below = Math.min(line.start.y, line.end.y);
    above = Math.max(line.start.y, line.end.y);
    return this.x >= left && this.x <= right &&
           this.y >= below && this.y <= above;
};
