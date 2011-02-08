modes.wall = (function(self) {
    var wall = null;

    var recordWall = actions.make(function(dump) {
        Elem.load(dump);
    }, function(dump) {
        Elem.load(dump).remove();
    });

    var getJoint = function(point) {
        var js = joints.at(point);
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
            recordWall(wall.dump());
            wall = null;
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
        if(wall) endWall(point);
        startWall(point);
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

    return mode(self);
})({});
