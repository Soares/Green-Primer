var geom = (function(self) {
    self.nearestIntersection = function(trajectory, lines) {
        var intersection = false;
        var distance = Infinity;
        $.each(lines, function(key, line) {
            var current = line.intersection(trajectory);
            var dist = current.distanceFrom(trajectory.start);
            if(dist < distance) {
                intersection = current;
                distance = dist;
            };
        });
        return intersection;
    };

    return self;
})(self);
