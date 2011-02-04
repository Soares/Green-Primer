var layout = (function(self) {
    var PRECISION = 1e-6;

    self.eq = function(x, y) { return Math.abs(x - y) < PRECISION; };
    self.lt = function(x, y) { return (y - x) > PRECISION; };
    self.gt = function(x, y) { return (x - y) > PRECISION; };

    self.neq = function(x, y) { return Math.abs(x - y) > PRECISION; };
    self.lte = function(x, y) { return self.lt(x, y) || self.eq(x, y); };
    self.gte = function(x, y) { return self.gt(x, y) || self.eq(x, y); };

    self.isZero = function(x) { return self.eq(x, 0); };

    // id must not start as zero, or ident||id++ would break.
    var id = 1, TYPE_ERR = 'Unrecognized Layout Type';
    var joints = [], walls = [], vents = [], windows = [];
    var arrayFor = function(type) {
        switch(type) {
            case self.JOINT: return joints;
            case self.WALL: return walls;
            case self.VENT: return vents;
            case self.WINDOW: return windows;
        }
    };
    var get = function(array, id) {
        for(var i = 0; i < array.length; i++) {
            if(array[i].id === id) return array[i];
        }
        return undefined;
    };

    self.JOINT = 'joint';
    self.WALL = 'wall';
    self.VENT = 'vent';
    self.WINDOW = 'window';

    self.register = function(type, object, ident) {
        var array = arrayFor(type);
        object.id = ident || (id++);
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
        get: function(id) { return get(joints, id) },
    };

    self.walls = {
        all: walls,
        lines: function() {
            var lines = [];
            $.each(walls, function(key, wall) {
                if(wall.$.is('.surreal')) return;
                lines.push(wall.segment);
            });
            return lines;
        },
        get: function(id) { return get(walls, id); },
    };

    self.vents = {
        open: function() {
            $.each(vents, function(key, vent) { vent.open(); });
        },
        close: function() {
            $.each(vents, function(key, vent) { vent.close(); });
        },
        reset: function() {
            $.each(vents, function(key, vent) { vent.reset(); });
        },
        step: function() {
            $.each(vents, function(key, vent) { vent.step(); });
        },
        draw: function(context) {
            $.each(vents, function(key, vent) { vent.draw(context); });
        },
        get: function(id) { return get(vents, id); },
    };

    self.windows = {
        get: function(id) { return get(windows, id); },
    };

    self.snap = function() {
        return $.map(arguments, function(x) {
            return Math.round(x / gp.GRID) * gp.GRID;
        });
    };

    $(function() {
        var triggerer = function(type) {
            return function(e) {
                var joints = dot.follower.jointsUnder();
                if(joints.length > 0) {
                    gp.layout.trigger('joint.' + type, [e, joints]);
                    return;
                }
                var target = $(e.originalEvent.target);
                if(target.is('button')) return;
                if(target.is('div:not(#key, #layout)')) return;
                gp.layout.trigger('canvas.' + type, [e]);
            };
        };
        var click = triggerer('click');

        $('#layout, #key').click(click).mousemove(function(e) {
            gp.layout.trigger('canvas.mousemove', [e]);
        });
        $('#dashboard, #toolbar').click(function(e) {
            gp.body.trigger('off.click', [e]);
        });
        $(document).keydown(function(e) {
            if(e.which === 27) gp.body.trigger('esc.keypress', [e]);
        });
    });

    return self;
})(layout || {});
