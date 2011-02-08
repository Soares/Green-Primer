var walls = (function(self) {
    return elements(self);
})(walls || {});

var Wall = Elem(function(source, dest, id) {
    this.source = source.attach(this);
    this.dest = dest.attach(this);
    this.line = gp.svg.path('M0 0L1 1');
    this.segment = new Line(source.point, dest.point);
    this.$ = $(this.line.node);
    this.elements = [];
    this.update();

    var self = this;
    this.$.addClass('wall').click(function(e) {
        gp.layout.trigger('wall.click', [e, self]);
    });
    this.init(id);
}, walls);

Wall.deserialize = function(object, id) {
    return new Wall(Element.load(dump.source), Element.load(dump.dest), id);
};
Wall.prototype.serialize = function() {
    return {'source': this.source.dump(), 'dest': this.dest.dump()};
};

Wall.prototype.matches = function(source, dest) {
    return this.source.point.equals(source) && this.dest.point.equals(dest)
        || this.dest.point.equals(source) && this.source.point.equals(dest);
};
Wall.prototype.valid = function(source, dest) {
    if(source.equals(dest)) return false;
    var line = new Line(source, dest);
    for(var i = 0; i < walls.all.length; i++) {
        var wall = walls.all[i];
        if(wall.id === this.id) continue;
        if(wall.matches(source, dest)) return false;
        if(Math.abs(line.m) === Math.abs(wall.segment.m)) {
            var ss = wall.source.point.distanceFrom(source);
            var sd = wall.source.point.distanceFrom(dest);
            var ds = wall.dest.point.distanceFrom(source);
            var dd = wall.dest.point.distanceFrom(dest);
            var len = wall.segment.length;
            if(wall.source.point.equals(source)) return dd > len;
            if(wall.source.point.equals(dest)) return ds > len;
            if(wall.dest.point.equals(source)) return sd > len;
            if(wall.dest.point.equals(dest)) return ss > len;
        } else if(wall.source.point.equals(source)
               || wall.source.point.equals(dest)
               || wall.dest.point.equals(source)
               || wall.dest.point.equals(dest)) {
        } else if(wall.segment.intersection(line)) return false;
    }
    return true;
};
Wall.prototype.update = function() {
    this.line.animate({path: [
        ['M', this.source.point.x, this.source.point.y],
        ['L', this.dest.point.x, this.dest.point.y]]});
    this.line.backward(3);
    this.segment = new Line(this.source.point, this.dest.point);
    return this;
};
Wall.prototype.move = function(source, dest) {
    this.source.move(source);
    this.dest.move(dest);
    return this;
};
Wall.prototype.shift = function(delta) {
    this.source.shift(delta);
    this.dest.shift(delta);
    return this;
}
Wall.prototype.remove = function() {
    /* Destroys joints if necessary */
    this.source.detach(this);
    this.dest.detach(this);
    this.line.remove();
    walls.forget(this);
    return null;
};
Wall.prototype.swap = function(current, next) {
    if(current.is(this.source)) this.source = next;
    else this.dest = next;
    current.detach(this);
    next.attach(this);
    return this;
};
Wall.prototype.not = function(joint) {
    if(joint.is(this.source)) return this.source;
    if(joint.is(this.dest)) return this.dest;
    return false;
};
Wall.prototype.cut = function() {
    var x = (this.source.point.x + this.dest.point.x) / 2;
    var y = (this.source.point.y + this.dest.point.y) / 2;
    var mid = new Joint(new Point(x, y));
    var child = new Wall(mid, this.dest);
    this.swap(this.dest, mid);
    this.update();
    return this;
};
