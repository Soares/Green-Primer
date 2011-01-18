var layout = (function(self) {
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
