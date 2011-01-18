modes.wall = (function(self) {
    var wall = null;

    var getJoint = function(position) {
        var point = new Point(position);
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
    self.button = $('#wall');
    self.dot = true;

    /* Start drawing a new wall from that joint */
    self.jointClick = function(e, click, joints) {
        if(wall) {
            var end = new Point(click);
            if(!wall.source.position.equals(end)) {
                recordWall(wall.source.position, new Point(click));
            }
            wall.remove();
            wall = null;
        } else startWall(click);
    };

    /* Add a new joint */
    self.canvasClick = function(e, click) {
        if(wall) {
            var end = new Point(click);
            if(!wall.source.position.equals(end)) {
                recordWall(wall.source.position, new Point(click));
            }
            wall.remove();
            startWall(wall.dest, click);
        } else startWall(click);
    };

    /* Move the current wall if any */
    self.canvasMove = function(e, click) {
        if(!wall) return;
        wall.dest.move(click);
    };

    self.wallClick = function(e, click, wall) {
        return this.canvasClick(e, click);
    };

    /* Cancel any wall being drawn */
    self.escPress = function() {
        wall = wall.remove();
    };

    /* Cancel any wall being drawn */
    self.offClick = function() {
        wall = wall.remove();
    };

    return mode(self);
})({});
