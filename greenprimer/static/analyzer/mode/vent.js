modes.vent = (function(self) {
    var vent = null;

    var makeVent = actions.make(function(dump) {
        Elem.load(dump);
    }, function(dump) {
        Elem.load(dump).remove();
    });

    var startVent = function(point) {
        var vent = new Vent(point);
        vent.placehold();
        return vent;
    };

    self.button = '#vent';
    self.dot = true;

    self.canvasClick = function(e, click) {
        var point = layout.point(click);
        if(vent) {
            var dump = vent.dump();
            vent.graduate();
            makeVent(dump);
            vent = null;
        } else vent = startVent(point);
    };

    self.canvasMove = function(e, click) {
        if(!vent) return;
        vent.direction = layout.point(click).minus(vent.point);
        vent.reorient();
    };

    self.escPress = self.offClick = function() {
        if(vent) vent = vent.remove();
    };

    return mode(self);
})({});
