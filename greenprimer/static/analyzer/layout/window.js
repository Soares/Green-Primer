var Window = function(point, id) {
    var handle = this;
    layout.register(layout.WINDOW, this, id);
    this.position = point;
    this.circle = gp.svg.circle(this.position.x, this.position.y, 7);
    this.$ = $(this.circle.node).addClass('window');
    this.$.click(function(e) {
        gp.layout.trigger('window.click', [e, handle]);
    });

    return this;
};
Window.load = function(dump) {
    return Window.find(dump) || new Window(dump.point, dump.id);
};
Window.find = function(dump) {
    return layout.windows.get(dump.id);
};

Window.prototype.dump = function() {
    return {
        maker: Window,
        id: this.id,
        point: this.point,
    };
};
