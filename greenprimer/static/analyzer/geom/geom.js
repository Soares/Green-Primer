var geom = (function(self) {
    var twopi = 2 * Math.PI;

    self.nearestIntersection = function(trajectory, lines) {
        var intersector = undefined;
        var intersection = undefined;
        var distance = Infinity;
        $.each(lines, function(key, line) {
            var current = line.intersection(trajectory);
            if(!current) return;
            var dist = current.distanceFrom(trajectory.start);
            if(dist < distance) {
                intersector = line;
                intersection = current;
                distance = dist;
            };
        });
        return intersector? [intersector, intersection] : false;
    };

    self.angle = function(theta) {
        return theta;
        while(theta > twopi) theta -= twopi;
        while(theta < 0) theta += twopi;
        return theta;
    };

    self.reflect = function(trajectory, line, point) {
        var before = new Line(trajectory.start, point);
        var angle = before.angleBetween(line);
        var theta = self.angle(Math.PI - angle + line.angle);
        var x = Math.cos(theta);
        var y = Math.sin(theta);
        if(trajectory.end.x < trajectory.start.x) x = -x;
        if(trajectory.end.y > trajectory.start.y) y = -y;
        return new Vector(x, y).normalize();
    };

    return self;
})(self);
