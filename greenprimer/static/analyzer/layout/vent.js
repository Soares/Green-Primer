var vents = (function(self) {
    return elements(self);
})(vents || {});

var Vent = function(wall, offset, direction, id) {
    this.length = 20;
    this.offset = offset;
    this.line = gp.svg.path('M0 0L1 1');
    this.pointer = gp.svg.path('M0 0L1 1');
    var $line = $(this.line.node).addClass('line');
    var $pointer = $(this.pointer.node).addClass('pointer');
    this.$ = $line.add($pointer);
    this.direction = direction || new Vector(1, 0);

    var self = this;
    this.$.addClass('vent').click(function(e) {
        gp.layout.trigger('vent.click', [e, self]);
    });

    this.init(id);
    this.wall = wall.attach(this);
    if(wall.outer) warnings.warn(warnings.EXTERIOR);
    this.update();
};
Elem(Vent, vents);

Vent.deserialize = function(object, id) {
    var wall = walls.find(object.wallid);
    return new Vent(wall, object.offset, object.direction, id);
};
Vent.prototype.serialize = function() {
    var object = {offset: this.offset, direction: this.direction};
    object.wallid = this.wall.id;
    return object;
};
Vent.prototype.save = function() {
    return {
        type: 'vent',
        offset: this.offset,
        dx: this.direction.x,
        dy: this.direction.y,
        id: this.id,
    };
};
Vent.load = function(wall, save) {
    var direction = new Vector(save.dx, save.dy);
    return new Vent(wall, save.offset, direction, save.id);
};

Vent.prototype.start = function() {
    return this.wall.alongBy(this.offset - (this.length / 2));
};
Vent.prototype.center = function() {
    return this.wall.alongBy(this.offset);
}
Vent.prototype.end = function() {
    return this.wall.alongBy(this.offset + (this.length / 2));
};
Vent.prototype.source = function() {
    return this.center().plus(this.direction);
};

Vent.prototype.update = function() {
    this.reorient();
    var start = this.start(), end = this.end();
    this.line.animate({path: [['M', start.x, start.y], ['L', end.x, end.y]]});
    return this;
};
Vent.prototype.reorient = function() {
    if(this.direction.x === 0 && this.direction.y === 0) return;
    this.direction = new Vector(this.direction.x, this.direction.y);
    this.direction.normalize();
    this.direction.scale(9);
    var center = this.center();
    var dest = this.direction.plus(center);
    this.pointer.animate({path: [
        ['M', center.x, center.y],
        ['L', dest.x, dest.y]]});
    return this;
};
Vent.prototype.remove = function() {
    if(this.wall.outer) warnings.unwarn(warnings.EXTERIOR);
    this.wall.detach(this);
    this.pointer.remove();
    this.line.remove();
    vents.forget(this);
    return null;
};
Vent.prototype.simulate = function() {
    physics.addEmitter(this.source(), this.direction, 1, Infinity);
};
