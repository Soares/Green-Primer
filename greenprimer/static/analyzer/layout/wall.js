var walls = (function(self) {
    return element(self);
})(walls || {});

var Wall = Element(function(source, dest, id) {
    layout.register(layout.WALL, this, id);
    this.source = source.attach(this);
    this.dest = dest.attach(this);
    this.line = gp.svg.path('M0 0L1 1');
    this.geom = 
    this.$ = $(this.line.node);
    this.elements = [];
    this.update();

    var self = this;
    this.$.addClass('wall').click(function(e) {
        gp.layout.trigger('wall.click', [e, self]);
    });
    this.init(id);
}, walls);

Wall.find = function(dump) {
    return layout.walls.get(dump.id);
};
Wall.load = function(dump) {
    return Wall.find(dump) || new Wall(
        Joint.load(dump.source),
        Joint.load(dump.dest),
        dump.id);
};

Wall.prototype.matches = function(source, dest) {
    return this.source.position.equals(source) && this.dest.position.equals(dest)
        || this.dest.position.equals(source) && this.source.position.equals(dest);
};
Wall.prototype.valid = function(source, dest) {
    if(source.equals(dest)) return false;
    source = source.snapToGrid(); dest = dest.snapToGrid();
    var line = new Line(source, dest);
    for(var i = 0; i < layout.walls.all.length; i++) {
        var wall = layout.walls.all[i];
        if(wall.id === this.id) continue;
        if(wall.matches(source, dest)) return false;
        if(Math.abs(line.m) === Math.abs(wall.segment.m)) {
            var ss = wall.source.position.distanceFrom(source);
            var sd = wall.source.position.distanceFrom(dest);
            var ds = wall.dest.position.distanceFrom(source);
            var dd = wall.dest.position.distanceFrom(dest);
            var len = wall.segment.length;
            if(wall.source.position.equals(source)) return dd > len;
            if(wall.source.position.equals(dest)) return ds > len;
            if(wall.dest.position.equals(source)) return sd > len;
            if(wall.dest.position.equals(dest)) return ss > len;
        } else if(wall.source.position.equals(source)
               || wall.source.position.equals(dest)
               || wall.dest.position.equals(source)
               || wall.dest.position.equals(dest)) {
        } else if(wall.segment.intersection(line)) return false;
    }
    return true;
};
Wall.prototype.is = function(elem) {
    return elem.data('id') === this.id;
};
Wall.prototype.update = function() {
    this.line.animate({path: [
        ['M', this.source.position.x, this.source.position.y],
        ['L', this.dest.position.x, this.dest.position.y]]});
    this.line.backward(3);
    this.segment = new Line(this.source.position, this.dest.position);
    return this;
};
Wall.prototype.placeholder = function() {
    this.$.addClass('surreal');
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
    layout.forget(this);
    return null;
};
Wall.prototype.swap = function(current, next) {
    if(current.id === this.source.id) {
        this.source = next;
    } else if(current.id === this.dest.id) {
        this.dest = next;
    } else throw "Bad swap: no such joint.";
    current.detach(this);
    next.attach(this);
    return this;
};
Wall.prototype.not = function(joint) {
    if(this.source.id === joint.id) return this.source;
    if(this.dest.id === joint.id) return this.dest;
    return false;
};
Wall.prototype.cut = function() {
    var x = (this.source.position.x + this.dest.position.x) / 2;
    var y = (this.source.position.y + this.dest.position.y) / 2;
    var mid = new Joint(new Vector(x, y).snapToGrid());
    var child = new Wall(mid, this.dest);
    this.swap(this.dest, mid);
    this.update();
    return this;
};
Wall.prototype.dump = function() {
    return {
        maker: Wall,
        id: this.id,
        source: this.source.dump(),
        dest: this.dest.dump(),
    };
};
