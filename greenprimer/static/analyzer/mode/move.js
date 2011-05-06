/* Move walls etc. around mode */
modes.move = (function(self) {
    var active, prev, origin;

    self.button = '#move';

    var recordMove = actions.make(function(dump) {
        Elem.load(dump).shift(dump.delta);
        graph.update();
    }, function(dump) {
        Elem.load(dump).shift(dump.delta.inverse());
        graph.update();
    });

    self.jointClick = function(e, click, joints) {
        if(active) return self.canvasClick(e, click);
        if(global.inner && joints[0].outer()) return;
        active = joints[0];
        prev = origin = layout.point(click);
    };
    self.wallClick = function(e, click, wall) {
        if(active) return self.canvasClick(e, click);
        if(global.inner && (wall.outer || wall.source.outer() || wall.dest.outer())) return;
        active = wall;
        prev = origin = layout.point(click);
    };
    self.canvasMove = function(e, click) {
        if(!active) return;
        var next = layout.point(click);
        var delta = next.minus(prev);
        if(delta.x === 0 && delta.y === 0) return;
        if(active instanceof Wall) {
            active.shift(delta);
            active.update();
        } else active.shift(delta);
        prev = next;
    };

    self.canvasClick = function(e, click) {
        var point = layout.point(click);
        if(!active) return;
        if(point.equals(origin)) return;
        self.canvasMove(e, click);
        var dump = active.dump();
        dump.delta = point.minus(origin);
        recordMove(dump);
        graph.update();
        active = prev = origin = null;
    };

    self.escPress = function(e) {
        active.shift(origin.minus(prev));
        active = prev = origin = null;
    };

    return mode(self);
})({});
