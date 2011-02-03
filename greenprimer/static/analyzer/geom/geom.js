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
        while(theta > twopi) theta -= twopi;
        while(theta < 0) theta += twopi;
        return theta;
    };

    self.reflect = function(velocity, line) {
        console.log('velocity is', velocity.x, velocity.y);
        var normal = line.normal();
        console.log('normal is', normal.x, normal.y);
        var scalar = 2 * velocity.dot(normal);
        console.log('scalar is', scalar);
        var reactor = normal.scale(scalar);
        console.log('reactor is', reactor.x, reactor.y);
        return velocity.minus(reactor).normalize();
    };

    return self;
})(self);
