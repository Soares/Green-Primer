/* Door data is sent by the server an output directly into the html files,
 * under globals.doors. Doors are stored as a pointer to the wall, the
 * type that allows them to look up their width etc. in global.doors,
 * and their offset along the wall. Like all elements, ID is passed
 * around because if we redraw a door we need to make sure that it
 * keeps the same id to protect future redo/undos from confusion. */
var doors = (function(self) {
    return elements(self);
})(doors || {});

var Door = function(wall, offset, type, id) {
    this.type = type;
    this.length = (global.doors[type].width / 12) * gp.SCALE;
    this.offset = offset;
    this.line = gp.svg.path('M0 0L1 1');
    this.$ = $(this.line.node);

    var self = this;
    this.$.addClass('door').click(function(e) {
        gp.layout.trigger('door.click', [e, self]);
    });
    if(wall.outer) this.$.addClass('outer');
    this.$.addClass('d'+global.doors[type].index);

    this.init(id);
    this.wall = wall.attach(this);
    this.update();
};
Elem(Door, doors);

Door.deserialize = function(object, id) {
    var wall = walls.find(object.wallid);
    return new Door(wall, object.offset, object.type, id);
};
Door.prototype.serialize = function() {
    var object = {offset: this.offset, type: this.type};
    object.wallid = this.wall.id;
    return object;
};
Door.prototype.save = function() {
    return {
        type: 'door',
        offset: this.offset,
        pk: this.type,
        id: this.id,
    };
};
Door.load = function(wall, save) {
    return new Door(wall, save.offset, save.pk, save.id);
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
