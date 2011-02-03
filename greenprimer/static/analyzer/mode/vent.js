modes.vent = (function(self) {
    var vent = null;

    self.type = modes.VENT;
    self.button = '#vent';
    self.dot = true;

    var startVent = function(point) {
        return new Vent(point).placeholder();
    };

    var makeVent = actions.make(function(start, end) {
        return new Vent(start, end.minus(start));
    }, function(vent) {
        vent.remove();
    });

    self.canvasClick = function(e, click) {
        var point = layout.point(click);
        if(vent) {
            makeVent(vent.position, point);
            vent = vent.remove();
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

