/* Joints connect walls. Usually they merge instead of stacking, but it's
 * possible to have multiple in the same place. */
var joints = (function(self) {
    self.at = function(point, inner) {
        return $.grep(self.all, function(joint) {
            var allowed = inner? !joint.outer() : true;
            return allowed && joint.isAt(point) && joint.isReal();
        });
    };

    self.merge = function(point) {
        var joints = self.at(point);
        var survivor = joints.pop();
        $.each(joints, function(key, joint) { joint.dieInto(survivor); });
    };

    return elements(self);
})(joints || {});


var Joint = function(point, walls, id) {
    this.walls = walls || {};
    this.count = 0;
    this.point = point.copy();
    this.circle = gp.svg.circle(this.point.x, this.point.y, 3);
    this.$ = $(this.circle.node);
    this.$.addClass('joint');
    this.init(id);
};
Elem(Joint, joints);

/* Serialization */
Joint.deserialize = function(object, id) {
    var walls = {};
    var joint = new Joint(object.point, walls, id);
    for(var id in object.walls) joint.attach(Elem.load(object.walls[id]));
    return joint;
};
Joint.prototype.serialize = function(shallow) {
    var data = {point: this.point, walls: {}};
    if(!shallow) for(var id in this.walls) {
        data.walls[id] = this.walls[id].dump();
    }
    return data;
};
Joint.prototype.save = function() {
    return {
        x: this.point.x,
        y: this.point.y,
        id: this.id,
    };
};
Joint.load = function(save) {
    return joints.find(save.id) || new Joint(new Point(save.x, save.y), {}, save.id);
};

/* Internal Functions */
Joint.prototype.outer = function() {
    for(var id in this.walls) if(this.walls[id].outer) return true;
    return false;
};
Joint.prototype.update = function() {
    this.circle.animate({cx: this.point.x, cy: this.point.y});
    for(var id in this.walls) this.walls[id].update();
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
    for(var id in this.walls) {
        this.detach(this.walls[id]);
        this.walls[id].swap(this, new Joint(this.point));
    }
};
Joint.prototype.dieInto = function(dest) {
    /* Die after giving the `dest` joint all your walls */
    var self = this;
    for(var id in this.walls) this.walls[id].swap(this, dest);
    return null;
};
Joint.prototype.remove = function() {
    for(var id in this.walls) this.walls[id].remove();
    return null;
};

/* Wall Manipulation */
Joint.prototype.attach = function(wall) {
    /* Add a wall coming from / going to this joint */
    if(this.walls[wall.id] === undefined) this.count++;
    this.walls[wall.id] = wall;
    this.circle.toFront();
    return this;
};
Joint.prototype.detach = function(wall) {
    /* Remove a wall coming from / going to this joint
     * Returns the joint if still active, undefined otherwise.
     * Use as `joint = joint.detach(wall)` */
    if(this.walls[wall.id]) this.count--;
    delete this.walls[wall.id];
    if(!this.count) this.destroy();
};
