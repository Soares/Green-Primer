var layout = (function(self) {
    var PRECISION = 1e-6;

    self.eq = function(x, y) { return Math.abs(x - y) < PRECISION; };
    self.lt = function(x, y) { return (y - x) > PRECISION; };
    self.gt = function(x, y) { return (x - y) > PRECISION; };

    self.neq = function(x, y) { return Math.abs(x - y) > PRECISION; };
    self.lte = function(x, y) { return self.lt(x, y) || self.eq(x, y); };
    self.gte = function(x, y) { return self.gt(x, y) || self.eq(x, y); };

    self.isZero = function(x) { return self.eq(x, 0); };

    self.snap = function() {
        return $.map(arguments, function(x) {
            return Math.round(x / gp.GRID) * gp.GRID;
        });
    };

    self.point = function(e) {
        var coords = util.eventCoords(e, true);
        return new Point(coords[0], coords[1]);
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

    self.reset = function() {
        physics.stop();
        while(walls.all.length > 0) walls.all[0].remove();
    };
    self.save = function() {
        var out = [];
        var length = 0;
        for(var i = 0; i < walls.all.length; i++) {
            if(walls.all[i].isReal()) {
                length += walls.all[i].length();
                out.push(walls.all[i].save());
            }
        }
        if(global.outer) return {'data': out, 'doors': {}, 'windows': {}, 'perimiter': length};
        var dout = {}, wout = {};
        for(var i in global.doors) dout[i] = 0;
        for(var i in global.windows) wout[i] = {count: 0, length: 0}
        $.each(doors.all, function(i, d) { dout[d.type]++; });
        $.each(windows.all, function(i, w) {
            wout[w.type].count++;
            wout[w.type].length += (w.length() / gp.SCALE) * 48;
        });
        return {
            'data': out,
            'doors': dout,
            'windows': wout,
            'perimiter': null,
        };
    };
    self.load = function(walls) {
        for(var i = 0; i < walls.length; i++) Wall.load(walls[i]);
    };

    return self;
})(layout || {});
