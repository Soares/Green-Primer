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
        object.id = type + '-' + array.length;
        object.index = array.length;
        object.type = type;
        array.push(object);
        return object;
    };

    self.forget = function(object) {
        arrayFor(object.type).splice(object.index, 1);
    };

    self.joints = {
        at: function(vector) {
            return $.grep(joints, function(joint) {
                return j.position.equals(vector);
            };
        },
        merge: function(vector) {
            var joints = self.joints.at(vector);
            var survivor = joints.pop();
            $.each(joints, function(key, joint) { joint.dieInto(survivor); });
        },
    };

    return self;
})(layout || {});
