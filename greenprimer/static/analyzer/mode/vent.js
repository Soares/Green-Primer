modes.vent = (function(self) {
    var vent, pos;

    var makeVent = actions.make(function(dump) {
        Elem.load(dump);
    }, function(dump) {
        Elem.load(dump).remove();
    });
    var delVent = actions.make(function(dump) {
        Elem.load(dump).remove();
    }, function(dump) {
        Elem.load(dump);
    });

    var startVent = function(point) {
        var vent = new Vent(point);
        vent.placehold();
        return vent;
    };

    self.button = '#vent';

    self.wallClick = function(e, click, wall) {
        var coords = util.eventCoords(click, true);
        var vector = new Vector(coords[0], coords[1]);
        var offset = vector.distanceFrom(wall.source.point);
        pos = layout.point(click);
        vent = new Vent(wall, offset);
    };

    self.canvasClick = function(e, click) {
        if(!vent) return;
        if(layout.point(click).equals(pos)) return;
        var dump = vent.dump();
        vent.graduate();
        makeVent(dump);
        vent = null;
        pos = null;
    };

    self.canvasMove = function(e, click) {
        if(!vent) return;
        vent.direction = layout.point(click).minus(pos);
        vent.reorient();
    };

    self.ventClick = function(e, click, vent) {
        delVent(vent.dump());
        vent.remove();
    };

    self.escPress = self.offClick = function() {
        if(vent) vent = vent.remove();
    };

    return mode(self);
})({});
