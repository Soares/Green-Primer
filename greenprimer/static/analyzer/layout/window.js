var windows = (function(self) {
    return elements(self);
})(windows || {});

var Window = function(wall, offset, length, id) {
    this.offset = offset;
    this.length = length || 1;
    this.line = gp.svg.path('M0 0L1 1');
    this.$ = $(this.line.node);

    var self = this;
    this.$.addClass('window').click(function() {
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
Window.prototype.serialize = function(shallow) {
    var object = {offset: this.offset, length: this.length};
    object.wallid = this.wall.id;
    return object;
};

Window.prototype.update = function() {
    var start = this.wall.alongBy(this.offset);
    var end = this.wall.alongBy(this.offset + this.length);
    this.line.animate({path: [['M', start.x, start.y], ['L', end.x, end.y]]});
    return this;
};
Window.prototype.remove = function() {
    this.wall.detach(this);
    this.line.remove();
    windows.forget(this);
    return null;
};
