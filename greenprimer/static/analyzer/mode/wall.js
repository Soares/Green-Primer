/* Wall mode. Slightly more complex than outline wall mode. */
modes.wall = (function(self) {
    var wall = null;

    var recordWall = actions.make(function(dump) {
        Elem.load(dump);
        graph.update();
    }, function(dump) {
        Elem.load(dump).remove();
        graph.update();
    });

    var getJoint = function(point) {
        var js = joints.at(point, global.inner);
        return js.length == 1? js[0] : new Joint(point);
    };
    var startWall = function(start) {
        var source = getJoint(start), dest = new Joint(start);
        dest.placehold();
        wall = new Wall(source, dest);
        wall.placehold();
        return wall;
    };
    var endWall = function(end) {
        if(wall.source.point.equals(end)) {
            wall = wall.remove();
        } else {
            var dest = getJoint(end);
            if(!dest.isReal()) dest.graduate();
            if(!wall.dest.is(dest)) {
                var old = wall.dest;
                wall.swap(wall.dest, dest);
                old.remove();
            }
            wall.graduate();
            var valid = wall.validate();
            if(!valid) {
                wall = wall.remove();
                return false;
            }
            recordWall(wall.dump());
            graph.update();
            wall = null;
            return true;
        }
    };

    self.button = '#wall';
    self.dot = true;

    /* Start drawing a new wall from that joint */
    self.jointClick = function(e, click, joints) {
        var point = layout.point(click);
        if(wall) endWall(point);
        else startWall(point);
    };

    /* Add a new joint */
    self.canvasClick = function(e, click) {
        var point = layout.point(click);
        if(wall) {
            if(endWall(point)) startWall(point);
        } else startWall(point);
    };

    /* Move the current wall if any */
    self.canvasMove = function(e, click) {
        if(!wall) return;
        wall.dest.move(layout.point(click));
    };

    self.wallClick = function(e, click, wall) {
        return self.canvasClick(e, click);
    };

    /* Cancel any wall being drawn */
    self.disengage = self.escPress = self.offClick = function() {
        if(wall) wall = wall.remove();
    };

    $(function() {
        $(document).keypress(function(e) {
            if(e.keyCode != 101) return;
            $('#wall').click();
        });
    });

    return mode(self);
})({});
