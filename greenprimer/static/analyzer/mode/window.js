modes['window'] = (function(self) {
    self.button = '#window';
    
    var makeWindow = actions.make(function(dump) {
        Elem.load(dump);
    }, function(dump) {
        Elem.load(dump).remove();
    });

    self.wallClick = function(e, click, wall) {
        var coords = util.eventCoords(click, true);
        var vector = new Vector(coords[0], coords[1]);
        var offset = vector.distanceFrom(wall.source.point);
        var win = new Window(wall, offset - 10, 20);
        makeWindow(win.dump());
    };

    return mode(self);
})({});
