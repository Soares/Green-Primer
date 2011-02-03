modes.move = (function(self) {
    var active, prev, origin;

    self.type = modes.MOVE;
    self.button = '#move';

    self.jointClick = function(e, click, joints) {
        if(active) return self.canvasClick(e, click);
        active = joints[0];
        prev = origin = layout.point(click);
    };
    self.wallClick = function(e, click, wall) {
        if(active) return self.canvasClick(e, click);
        active = wall;
        prev = origin = layout.point(click);
    };
    self.ventClick = function(e, click, vent) {
        active = vent;
        prev = origin = layout.point(click);
    };
    self.canvasMove = function(e, click) {
        if(!active) return;
        var next = layout.point(click);
        var delta = next.minus(prev);
        if(delta.x === 0 && delta.y === 0) return;
        active.shift(delta);
        if(active instanceof Wall) active.update();
        prev = next;
    };

    self.canvasClick = function(e, click) {
        if(!active) return;
        if(layout.point(click).equals(origin)) return;
        self.canvasMove(e, click);
        active = prev = origin = null;
    };

    return mode(self);
})({});
