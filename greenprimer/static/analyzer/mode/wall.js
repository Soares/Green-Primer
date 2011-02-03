modes.wall = (function(self) {
    var wall = null;

    var recordWall = actions.make(function(dump) {
        Wall.load(dump);
    }, function(dump) {
        Wall.find(dump).remove();
    });

    var getJoint = function(point) {
        var joints = layout.joints.at(point);
        return joints.length == 1? joints[0] : new Joint(point);
    };
    var startWall = function(start) {
        var source = getJoint(start), dest = new Joint(start).placeholder();
        wall = new Wall(source, dest).placeholder();
        return wall;
    };
    var endWall = function(end) {
        var dest = getJoint(end);
        var real = new Wall(wall.source, dest);
        var dump = real.dump();
        real.remove();
        wall = wall.remove();
        recordWall(dump);
    };

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
            if(!wall.source.position.equals(point)) endWall(point);
            else wall = wall.remove();
        } else startWall(point);
    };

    /* Add a new joint */
    self.canvasClick = function(e, click) {
        var point = layout.point(click);
        if(wall) {
            if(!wall.source.position.equals(point)) endWall(point);
            else wall = wall.remove();
        }
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
    self.escPress = self.offClick = function() {
        if(wall) wall = wall.remove();
    };

    return mode(self);
})({});
