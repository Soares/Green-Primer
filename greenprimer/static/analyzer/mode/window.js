/* Window placement mode. 'window' is a js keyword, hence the ['window'] use. */
modes['window'] = (function(self) {
    self.button = '#window';
    
    var makeWindow = actions.make(function(dump) {
        Elem.load(dump);
    }, function(dump) {
        Elem.load(dump).remove();
    });
    var delWindow = actions.make(function(dump) {
        Elem.load(dump).remove();
    }, function(dump) {
        Elem.load(dump);
    });

    self.wallClick = function(e, click, wall) {
        if(!wall.outer) return;
        var coords = util.eventCoords(click, true);
        var vector = new Vector(coords[0], coords[1]);
        var offset = vector.distanceFrom(wall.source.point);
        var type = $('#window-types :selected').val();
        var win = new Window(wall, offset, type);
        makeWindow(win.dump());
    };
    self.windowClick = function(e, click, win) {
        delWindow(win.dump());
        win.remove();
    };

    return mode(self);
})({});
