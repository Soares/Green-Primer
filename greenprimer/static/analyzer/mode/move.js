modes.move = (function(self) {
    var active, prev, origin;

    self.button = '#move';

    var recordMove = actions.make(function(dump) {
        Elem.load(dump).shift(dump.delta);
    }, function(dump) {
        Elem.load(dump).shift(dump.delta.inverse());
    });

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
    self.canvasMove = function(e, click) {
        if(!active) return;
        var next = layout.point(click);
        if(click.shiftKey) {
            // Allows you to 'catch up' the mouse
            prev = next;
            return;
        }
        var delta = next.minus(prev);
        if(delta.x === 0 && delta.y === 0) return;
        if(active instanceof Wall) {
            var valid = active.valid(
                active.source.point.plus(delta),
                active.dest.point.plus(delta));
            if(!valid) return;
            active.shift(delta);
            active.update();
        } else if(active instanceof Joint) {
            var pos = active.point;
            active.shift(delta);
            var valid = true;
            for(var i = 0; i < walls.all.length; i++) {
                var wall = walls.all[i];
                valid = wall.valid();
                if(!valid) break;
            }
            if(!valid) active.move(pos);
        } else {
            active.shift(delta);
        }
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
        active = prev = origin = null;
    };

    return mode(self);
})({});
