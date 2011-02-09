var doors = (function(self) {
    return elements(self);
})(doors || {});

var Door = function(wall, offset, length, id) {
    this.length = length || 20;
    this.offset = offset;
    this.line = gp.svg.path('M0 0L1 1');
    this.$ = $(this.line.node);

    var self = this;
    this.$.addClass('door').click(function(e) {
        gp.layout.trigger('door.click', [e, self]);
    });

    this.init(id);
    this.wall = wall.attach(this);
    this.update();
};
Elem(Door, doors);

Door.deserialize = function(object, id) {
    var wall = walls.find(object.wallid);
    return new Door(wall, object.offset, object.length, id);
};
Door.prototype.serialize = function() {
    var object = {offset: this.offset, length: this.length};
    object.wallid = this.wall.id;
    return object;
};
Door.prototype.save = function() {
    return {
        type: 'door',
        offset: this.offset,
        length: this.length,
        id: this.id,
    };
};
Door.load = function(wall, save) {
    return new Door(wall, save.offset, save.length, save.id);
};

Door.prototype.start = function() {
    return this.wall.alongBy(this.offset - (this.length / 2));
};
Door.prototype.center = function() {
    return this.wall.alongBy(this.offset);
}
Door.prototype.end = function() {
    return this.wall.alongBy(this.offset + (this.length / 2));
};

Door.prototype.update = function() {
    var start = this.start(), end = this.end();
    this.line.animate({path: [['M', start.x, start.y], ['L', end.x, end.y]]});
    return this;
};
Door.prototype.remove = function() {
    this.wall.detach(this);
    this.line.remove();
    doors.forget(this);
    return null;
};
