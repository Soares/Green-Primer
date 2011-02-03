modes['window'] = (function(self) {
    self.type = modes.WINDOW;
    self.button = '#window';
    
    var makeWindow = actions.make(function(dump) {
        Window.load(dump);
    }, function(dump) {
        Window.find(dump).remove();
    });

    self.wallClick = function(e, click) {
        var coords = util.eventCoords(click, true);
        var win = new Window(new Vector(coords[0], coords[1]));
        var dump = win.dump();
        makeWindow(dump);
    };

    return mode(self);
})({});


