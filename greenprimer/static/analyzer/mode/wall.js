modes.wall = (function(self) {
    var wall = null;

    var getJoint = function(point) {
        var joints = layout.joints.at(point);
        return joints.length == 1? joints[0] : new Joint(point);
    };
    var startWall = function(start, end) {
        var source = end? start : getJoint(start);
        var dest = new Joint(end || start).placeholder();
        wall = new Wall(source, dest).placeholder();
        return wall;
    };

    var recordWall = actions.make(function(start, end) {
        var source = getJoint(start);
        var dest = getJoint(end);
        return new Wall(source, dest);
    }, function(wall) {
        wall.remove();
    });

    self.type = modes.WALL;
    self.button = '#wall';
    self.dot = true;

    self.disengage = function() {
        if(wall) wall = wall.remove();
    };

    /* Start drawing a new wall from that joint */
    self.jointClick = function(e, click, joints) {
        var point = layout.point(click);
        if(wall) {
            if(!wall.source.position.equals(point)) {
                recordWall(wall.source.position, point);
            }
            wall = wall.remove();
        } else startWall(point);
    };

    /* Add a new joint */
    self.canvasClick = function(e, click) {
        var point = layout.point(click);
        if(wall) {
            if(!wall.source.position.equals(point)) {
                recordWall(wall.source.position, point);
            }
            wall.remove();
            startWall(wall.dest, point);
        } else startWall(point);
    };

    /* Move the current wall if any */
    self.canvasMove = function(e, click) {
        if(!wall) return;
        wall.dest.move(layout.point(click));
    };

    self.wallClick = function(e, click, wall) {
        return this.canvasClick(e, click);
    };

    /* Cancel any wall being drawn */
    self.escPress = self.offClick = function() {
        if(wall) wall = wall.remove();
    };

    return mode(self);
})({});
