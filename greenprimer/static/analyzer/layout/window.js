var windows = (function(self) {
    return elements(self);
})(windows || {});

var Window = function(wall, offset, length, id) {
    this.offset = offset;
    this.length = length || 1;
    this.line = gp.svg.path('M0 0L1 1');
    this.$ = $(this.line.node);

    var self = this;
    this.$.addClass('window').click(function(e) {
        gp.layout.trigger('window.click', [e, self]);
    });

    this.init(id);
    this.wall = wall.attach(this);
    this.update();
};
Elem(Window, windows);

Window.deserialize = function(object, id) {
    var wall = walls.find(object.wallid);
    return new Window(wall, object.offset, object.length, id);
};
Window.prototype.serialize = function() {
    var object = {offset: this.offset, length: this.length};
    object.wallid = this.wall.id;
    return object;
};
Window.prototype.save = function() {
    return {
        type: 'window',
        offset: this.offset,
        length: this.length,
        id: this.id,
    };
};
Window.load = function(wall, save) {
    return new Window(wall, save.offset, save.length, save.id);
};

Window.prototype.start = function() {
    return this.wall.alongBy(this.offset - (this.length / 2));
};
Window.prototype.center = function() {
    return this.wall.alongBy(this.offset);
}
Window.prototype.end = function() {
    return this.wall.alongBy(this.offset + (this.length / 2));
};

Window.prototype.update = function() {
    var start = this.start(), end = this.end();
    this.line.animate({path: [['M', start.x, start.y], ['L', end.x, end.y]]});
    return this;
};
Window.prototype.remove = function() {
    this.wall.detach(this);
    this.line.remove();
    windows.forget(this);
    return null;
};
