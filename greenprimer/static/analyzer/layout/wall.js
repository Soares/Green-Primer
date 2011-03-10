var walls = (function(self) {
    return elements(self);
})(walls || {});

var Wall = function(source, dest, outer, id) {
    this.segment = new Line(source.point, dest.point);
    this.line = gp.svg.path('M0 0L1 1');
    this.$ = $(this.line.node);
    this.elements = [];
    this.outer = outer;

    var self = this;
    this.$.addClass('wall').click(function(e) {
        gp.layout.trigger('wall.click', [e, self]);
    });
    if(this.outer) this.$.addClass('outer');

    this.init(id);
    this.source = source.attach(this);
    this.dest = dest.attach(this);
    this.update();
};
Elem(Wall, walls);

Wall.deserialize = function(object, id) {
    var elements = [];
    var wall = new Wall(Elem.load(object.source), Elem.load(object.dest), object.outer, id);
    for(var i = 0; i < object.elements.length; i++) {
        elements.push(Elem.load(object.elements[i]));
    }
    return wall;
};
Wall.prototype.serialize = function(shallow) {
    var object = {
        source: this.source.dump(true),
        dest: this.dest.dump(true),
        outer: this.outer? true : false,
        elements: [],
    };
    if(!shallow) for(var i = 0; i < this.elements.length; i++) {
        object.elements.push(this.elements[i].dump(true));
    }
    return object;
};
Wall.prototype.save = function() {
    var elements = [];
    for(var i = 0; i < this.elements.length; i++) {
        elements.push(this.elements[i].save());
    }
    return {
        id: this.id,
        source: this.source.save(),
        dest: this.dest.save(),
        outer: this.outer? true : false,
        elements: elements,
    };
};
Wall.load = function(save) {
    var source = Joint.load(save.source);
    var dest = Joint.load(save.dest);
    var wall = walls.find(save.id) || new Wall(source, dest, save.outer, save.id);
    for(var i = 0; i < save.elements.length; i++) {
        var element = save.elements[i];
        if(element.type === 'door') Door.load(wall, element);
        if(element.type === 'vent') Vent.load(wall, element);
        if(element.type === 'window') Window.load(wall, element);
    }
    return wall;
};

Wall.prototype.length = function() {
    return this.source.point.distanceFrom(this.dest.point);
};
Wall.prototype.attach = function(element) {
    this.elements.push(element);
    return this;
};
Wall.prototype.detach = function(element) {
    for(var i = 0; i < this.elements.length; i++) {
        if(this.elements[i] === element) break;
    }
    this.elements.splice(i, 1);
};

Wall.prototype.matches = function(source, dest) {
    return this.source.point.equals(source) && this.dest.point.equals(dest)
        || this.dest.point.equals(source) && this.source.point.equals(dest);
};
Wall.prototype.validate = function() {
    if(this.dest.point.distanceFrom(this.source.point) === 0) return false;
    for(var i = 0; i < walls.all.length; i++) {
        if(walls.all[i].id === this.id) continue;
        if(this.overlaps(walls.all[i])) return false;
    }
    return true;
};
Wall.prototype.overlaps = function(other) {
    if(Math.abs(this.segment.m) != Math.abs(other.segment.m)) return false;
    if(this.segment.b != other.segment.b) return false;
    var end = this.dest.point.distanceFrom(this.source.point);
    var one = other.source.point.distanceFrom(this.source.point);
    var two = other.dest.point.distanceFrom(this.source.point);
    if(end < 0) { end *= -1; one *= -1; two *= -1; }
    if(one > 0 && one < end) return true;
    if(two > 0 && two < end) return true;
    if(one <= 0 && two >= end) return true;
    if(two <= 0 && one >= end) return true;
    return false;
};
Wall.prototype.update = function() {
    this.line.animate({path: [
        ['M', this.source.point.x, this.source.point.y],
        ['L', this.dest.point.x, this.dest.point.y]]});
    this.line.backward(3);
    this.segment = new Line(this.source.point, this.dest.point);
    for(var i = 0; i < this.elements.length; i++) this.elements[i].update();
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
    var elements = $.merge([], this.elements);
    for(var i = 0; i < elements.length; i++) elements[i].remove();
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


Wall.prototype.alongBy = function(n) {
    var point = this.dest.point.minus(this.source.point);
    var vector = new Vector(point.x, point.y);
    vector.normalize();
    vector.scale(n);
    vector.add(this.source.point);
    return vector;
};

Wall.prototype.doors = function() {
    var doors = [];
    for(var i = 0; i < this.elements.length; i++) {
        if(this.elements[i] instanceof Door) doors.push(this.elements[i]);
    }
    var start = this.source.point;
    doors.sort(function(a, b) {
        var adist = a.start().distanceFrom(start);
        var bdist = b.start().distanceFrom(start);
        return adist - bdist;
    });
    return doors;
};
Wall.prototype.segments = function() {
    var start = this.source.point, doors = this.doors();
    if(!doors.length) return [this.segment];
    var segments = [];
    if(!this.outer) for(var i = 0; i < doors.length; i++) {
        segments.push(new Line(start, doors[i].start()));
        start = doors[i].end();
    }
    segments.push(new Line(start, this.dest.point));
    return segments;
};
Wall.prototype.simulate = function() {
    var segments = this.segments();
    for(var i = 0; i < segments.length; i++) {
        physics.addLine(segments[i], 6);
    }
    return segments;
};
