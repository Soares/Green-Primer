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
        var normal = line.normal();
        var scalar = 2 * velocity.dot(normal);
        var reactor = normal.scale(scalar);
        return velocity.minus(reactor).normalize();
    };

    self.restitution = .9;

    self.bounce = function(p1, p2, impact) {
        var delta = p1.position.minus(p2.position);
        var d = delta.length();
        // Minimum translation distance
        var mtd = delta.scale(((p1.radius + p2.radius)-d)/d);

        var im1 = 1 / p1.mass;
        var im2 = 1 / p2.mass;

        var dp1 = mtd.scale(im1 / (im1 + im2));
        var dp2 = mtd.scale(im2 / (im1 + im2));
        p1.position.add(dp1);
        p2.position.add(dp2);

        var v = p1.velocity.minus(p2.velocity);
        var vn = p1.dot(mtd.normalize());

        if(vn > 0) return;
        var i = (-(1 + self.restitution) * vn) / (im1 + im2);
        var impulse = mtd.scale(i);

        p1.velocity.add(impulse.scale(im1));
        p2.velocity.subtract(impulse.scale(im2));
    };

    return self;
})(self);
