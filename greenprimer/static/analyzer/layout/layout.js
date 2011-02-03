var layout = (function(self) {
    var PRECISION = 1e-6;

    self.eq = function(x, y) { return Math.abs(x - y) < PRECISION; };
    self.lt = function(x, y) { return (y - x) > PRECISION; };
    self.gt = function(x, y) { return (x - y) > PRECISION; };

    self.neq = function(x, y) { return Math.abs(x - y) > PRECISION; };
    self.lte = function(x, y) { return self.lt(x, y) || self.eq(x, y); };
    self.gte = function(x, y) { return self.gt(x, y) || self.eq(x, y); };

    self.isZero = function(x) { return self.eq(x, 0); };

    var id = 0, TYPE_ERR = 'Unrecognized Layout Type';
    var joints = [], walls = [];
    var arrayFor = function(type) {
        switch(type) {
            case self.JOINT: return joints;
            case self.WALL: return walls;
        }
    };

    self.JOINT = 'joint'; self.WALL = 'wall';

    self.register = function(type, object) {
        var array = arrayFor(type);
        object.id = type + '-' + (id++);
        object.type = type;
        array.push(object);
        return object;
    };

    self.forget = function(object) {
        var array = arrayFor(object.type);
        for(var i = 0; i < array.length; i++) {
            if(array[i].id == object.id) break;
        }
        array.splice(i, 1);
    };

    self.point = function(e) {
        var coords = util.eventCoords(e, true);
        return Vector.from.apply(this, coords).snapToGrid();
    };

    self.joints = {
        at: function(point) {
            return $.grep(joints, function(joint) {
                return joint.position.equals(point) && !joint.$.is('.surreal');
            });
        },
        merge: function(vector) {
            var joints = self.joints.at(vector);
            var survivor = joints.pop();
            $.each(joints, function(key, joint) { joint.dieInto(survivor); });
        },
    };

    self.walls = {
        lines: function() {
            var lines = [];
            $.each(walls, function(key, wall) {
                if(wall.$.is('.surreal')) return;
                lines.push(wall.geomLine());
            });
            return lines;
        },
    };

    self.snap = function() {
        return $.map(arguments, function(x) {
            return Math.round(x / gp.GRID) * gp.GRID;
        });
    };

    $(function() {
        $('#layout, #key').click(function(e) {
            var joints = dot.follower.jointsUnder();
            if(joints.length > 0) {
                gp.layout.trigger('joint.click', [e, joints]);
                return;
            }
            var target = $(e.originalEvent.target);
            if(target.is('button')) return;
            if(target.is('div:not(#key, #layout)')) return;
            gp.layout.trigger('canvas.click', [e]);
        }).mousemove(function(e) {
            gp.layout.trigger('canvas.mousemove', [e]);
        });
    });

    return self;
})(layout || {});
