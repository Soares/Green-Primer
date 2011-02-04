var Joint = function(position, id) {
    layout.register(layout.JOINT, this, id);
    this.walls = [];
    this.position = Vector.from(position);
    this.circle = gp.svg.circle(this.position.x, this.position.y, 4);
    this.$ = $(this.circle.node);
    this.$.addClass('joint');
    return this;
};

Joint.load = function(dump) {
    return Joint.find(dump) || new Joint(dump.point, dump.id);
};
Joint.find = function(dump) {
    return layout.joints.get(dump.id);
};
Joint.prototype.placeholder = function() {
    this.$.addClass('surreal');
    return this;
};
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
Joint.prototype.destroy = function() {
    /* Destructor. Clean up all resources. */
    this.circle.remove();
    layout.forget(this);
    return null;
};
Joint.prototype.move = function(point) {
    /* Move the joint and all attached walls */
    this.position = Vector.from(point);
    this.circle.animate({cx: this.position.x, cy: this.position.y});
    $.each(this.walls, function(key, wall) { wall.update(); });
    return this;
};
Joint.prototype.shift = function(point) {
    /* Shift this joint and all attached walls */
    return this.move(point.plus(this.position));
};

Joint.prototype.split = function() {
    /* Split this point so that each connected wall has a separate joint */
    var self = this, usedSelf = false;
    $.each(this.walls, function(key, wall) {
        self.detach(wall);
        var next = usedSelf? new Joint(self.position.copy()) : self;
        wall.swap(self, next);
        usedSelf = true;
    });
    return null;
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
Joint.prototype.remove = function() {
    /* Remove this joint and all attached walls */
    // The last call to wall.remove() will trigger the joint's destroy().
    $.each(this.walls, function(key, wall) { wall.remove(); });
    return null;
};
Joint.prototype.dieInto = function(dest) {
    /* Die after giving the `dest` joint all your walls */
    var self = this;
    $.each(this.walls, function(key, wall) { wall.swap(self, dest); });
    // The last call to wall.swap() will trigger the joint's destroy().
    return null;
};
Joint.prototype.dump = function() {
    return {
        maker: Joint,
        point: this.position,
        id: this.id,
    };
};
