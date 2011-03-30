var windows = (function(self) {
    return elements(self);
})(windows || {});

var Window = function(wall, offset, type, id) {
    this.curtain = global.windows[type].curtain;
    this._offset = offset;
    this._length = (global.windows[type].width / 12) * gp.SCALE;
    this.line = gp.svg.path('M0 0L1 1');
    this.$ = $(this.line.node);
    this.type = type;

    var self = this;
    this.$.addClass('window').addClass('outer').click(function(e) {
        gp.layout.trigger('window.click', [e, self]);
    });
    this.$.addClass('w'+global.windows[type].index);

    this.init(id);
    this.wall = wall.attach(this);
    this.update();
};
Elem(Window, windows);

Window.deserialize = function(object, id) {
    var wall = walls.find(object.wallid);
    return new Window(wall, object.offset, object.type, id);
};
Window.prototype.serialize = function() {
    var object = {offset: this.offset, type: this.type};
    object.wallid = this.wall.id;
    return object;
};
Window.prototype.save = function() {
    return {
        type: 'window',
        offset: this._offset,
        pk: this.type,
        id: this.id,
    };
};
Window.load = function(wall, save) {
    return new Window(wall, save.offset, save.pk, save.id);
};

Window.prototype.length = function() {
    return this.curtain? this.wall.length() : this._length;
};
Window.prototype.offset = function() {
    return this.curtain? this.length() / 2 : this._offset;
};

Window.prototype.start = function() {
    return this.wall.alongBy(this.offset() - (this.length() / 2));
};
Window.prototype.center = function() {
    return this.wall.alongBy(this.offset());
}
Window.prototype.end = function() {
    return this.wall.alongBy(this.offset() + (this.length() / 2));
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
