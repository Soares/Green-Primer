var joints = (function(self) {
    self.at = function(point) {
        return $.grep(self.all, function(joint) {
            return joint.isAt(point) && joint.isReal();
        });
    };

    self.merge = function(point) {
        var joints = self.at(point);
        var survivor = joints.pop();
        $.each(joints, function(key, joint) { joint.dieInto(survivor); });
    };

    return elements(self);
})(joints || {});


var Joint = Elem(function(point, id) {
    this.walls = [];
    this.point = point.copy();
    this.circle = gp.svg.circle(this.point.x, this.point.y, 4);
    this.$ = $(this.circle.node);
    this.$.addClass('joint');
    this.init(id);
}, joints);

/* Serialization */
Joint.deserialize = function(object, id) {
    return new Joint(object.point, id);
};
Joint.prototype.serialize = function() {
    return {'point': this.point};
};

/* Internal Functions */
Joint.prototype.update = function() {
    this.circle.animate({cx: this.point.x, cy: this.point.y});
    $.each(this.walls, function(key, wall) { wall.update(); });
    return this;
};
Joint.prototype.destroy = function() {
    /* Destructor. Clean up all resources. */
    this.circle.remove();
    joints.forget(this);
    return null;
};

/* Joint Functions */
Joint.prototype.isAt = function(point) {
    return this.point.equals(point);
};
Joint.prototype.move = function(point) {
    this.point.move(point);
    return this.update();
};
Joint.prototype.shift = function(point) {
    this.point.shift(point);
    return this.update();
};
Joint.prototype.split = function() {
    for(var i = 1; i < this.walls.length; i++) {
        this.detach(this.walls[i]);
        this.walls[i].swap(this, new Joint(this.point.copy()));
    }
};
Joint.prototype.dieInto = function(dest) {
    /* Die after giving the `dest` joint all your walls */
    var self = this;
    $.each(this.walls, function(key, wall) { wall.swap(self, dest); });
    return null;
};
Joint.prototype.remove = function() {
    $.each(this.walls, function(key, wall) { wall.remove(); });
    return null;
};

/* Wall Manipulation */
Joint.prototype.attach = function(wall) {
    /* Add a wall coming from / going to this joint */
    this.walls.push(wall);
    this.circle.toFront();
    return this;
};
Joint.prototype.detach = function(wall) {
    /* Remove a wall coming from / going to this joint
     * Returns the joint if still active, undefined otherwise.
     * Use as `joint = joint.detach(wall)` */
    for(var i = 0; i < this.walls.length; i++) {
        if(this.walls[i].id === wall.id) break;
    }
    this.walls.splice(i, 1);
    return this.walls.length? this : this.destroy();
};
Joint.prototype.combine = function() {
    /* If there are only two attached lines, combine them and die.
     * Return true if the combine happened, false otherwise. */
    if(this.walls.length != 2) return false;
    var a = this.walls[0], b = this.walls[1];
    b.swap(this, a.not(this));
    b.update();
    a.remove();
    return true;
};
