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
        if(click.shiftKey) {
            // Allows you to 'catch up' the mouse
            prev = next;
            return;
        }
        var delta = next.minus(prev);
        if(delta.x === 0 && delta.y === 0) return;
        if(active instanceof Wall) {
            var valid = active.valid(active.source.position.plus(delta),
                                     active.dest.position.plus(delta));
            if(!valid) return;
            active.shift(delta);
            active.update();
        } else if(active instanceof Joint) {
            var pos = active.position;
            active.shift(delta);
            var valid = true;
            for(var i = 0; i < layout.walls.all.length; i++) {
                var wall = layout.walls.all[i];
                valid = wall.valid(wall.source.position, wall.dest.position); 
                if(!valid) break;
            }
            if(!valid) active.move(pos);
        } else {
            active.shift(delta);
        }
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
