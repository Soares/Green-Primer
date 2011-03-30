var area = (function(self) {
    self.centroid = function(vertices) {
        return new Vector(vertices[0].x, vertices[0].y);
        /* NVM, not guaranteed to be in the house
        var x = 0, y = 0;
        for(var i = 0; i < vertices.length; i++) {
            x += vertices[i].x;
            y += vertices[i].y;
        }
        return new Vector(x / vertices.length, y / vertices.length);
        */
    };

    self.adjust = function(vertices) {
        // Put them around a centroid
        // Scale them pixels -> feet
        var c = self.centroid(vertices);
        var helper = [];
        for(var i = 0; i < vertices.length; i++) {
            var old = vertices[i];
            var vec = new Vector(old.x - c.x, old.y -c.y);
            vec.scale(1.0 / gp.SCALE);
            var ang = Math.atan2(vec.y, vec.x);
            helper.push([vec, ang]);
        };
        helper.sort(function(a, b) { return a[1] - b[1]; });
        var vectors = [];
        for(var i = 0; i < helper.length; i++) vectors.push(helper[i][0]);
        return vectors;
    };

    self.cycle = function(walls) {
        if(!walls || walls.length < 3) return null;
        var path = [], seen = {};

        var mark = function(wall) { seen[wall.id] = true; };
        var push = function(point) { path.push(point); };
        var follow = function(point) {
            for(var i = 0; i < walls.length; i++) {
                var wall = walls[i];
                if(seen[wall.id]) continue;
                var s = wall.source.point;
                var d = wall.dest.point;
                if(s.equals(point)) return [wall, d];
                if(d.equals(point)) return [wall, s];
            }
        };

        var first = walls[0].source.point;
        var result = [walls[0], first];

        do {
            push(result[1]);
            result = follow(result[1]);
            if(!result) return null;
            mark(result[0]);
        } while(!result[1].equals(first));
        return path;
    };

    self.of = function(vertices) {
        if(!vertices || vertices.length < 3) return null;
        var xs = [], ys = [], count = vertices.length;
        for(var i = 0; i < count; i++) {
            xs[i] = vertices[i].x;
            ys[i] = vertices[i].y;
        }
        xs[count] = xs[0];
        ys[count] = ys[0];

        var area = 0.0;
        for(var i = 0; i < count; i++) {
            var dx = xs[i+1] - xs[i];
            var dy = ys[i+1] - ys[i];
            area += (xs[i] * dy) - (ys[i] * dx);
        }
        return area / 2.0;
    };

    self.internal = function() {
        return self.of(self.adjust(self.cycle(walls.all)));
    };

    return self;
})(area || {});
