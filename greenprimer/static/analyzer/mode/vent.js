modes.vent = (function(self) {
    var vent = null;

    self.type = modes.VENT;
    self.button = '#vent';
    self.dot = true;

    var startVent = function(point) {
        return new Vent(point).placeholder();
    };

    var makeVent = actions.make(function(dump) {
        Vent.load(dump);
    }, function(dump) {
        Vent.find(dump).remove();
    });

    self.canvasClick = function(e, click) {
        var point = layout.point(click);
        if(vent) {
            var dump = vent.dump();
            vent = vent.remove();
            makeVent(dump);
        } else vent = startVent(point);
    };

    self.canvasMove = function(e, click) {
        if(!vent) return;
        vent.reorient(layout.point(click).minus(vent.position));
    };

    self.escPress = self.offClick = function() {
        if(vent) vent = vent.remove();
    };

    return mode(self);
})({});

