BoundingVolume.ID = 0;
BoundingVolume.findIntersect = function(list, volume) {
    for(var i = 0; i < list.length; i++) {
        if(list[i].intersects[volume]) return list[i];
    }
    return null;
};

BoundingVolume.prototype.init = function() {
    this.position = new Vector();
    this.axis = [];
    this.fixed = true;
    this.id = BoundingVolume.id++;
    this.margin = fluids.FLOAT_EPSILON;
};
BoundingVolume.prototype.project = function(axis) { throw "unimplemented"; };
BoundingVolume.prototype.draw = function(axis) { throw "unimplemented"; };

BoundingVolume.prototype.intersects = function(other, penetration) {
    penetration = penetration || {normal: new Vector(), length: Infinity};
    for(var i = 0; i < this.axis.length; i++) {
        if(!this.findLeastPenetrating(this.axis[i], other, penetration)) {
            return false;
        }
    }
    for(var i = 0; i < other.axis.length; i++) {
        if(!this.findLeastPenetrating(other.axis[i], other, penetration)) {
            return false;
        }
    }
    if(other.position.minus(this.position).dot(penetration.normal) > 0) {
        penetration.normal.x *= -1;
        penetration.normal.y *= -1;
    }
    return true;
};
BoundingVolume.prototype.findLeastPenetrating = function(axis, other, penetration) {
    var refs = {minThis: 0, maxThis: 0, minOther: 0, maxOther: 0};
    if(this.testSeparatingAxis(axis, other, refs)) return false;
    var diff = Math.min(refs.maxOther, refs.maxThis) - Math.max(refs.minOther, refs.minThis);
    if(diff < penetration.length) {
        penetration.length = diff;
        penetration.normal = axis;
    }
    return true;
};
BoundingVolume.prototype.testSeparatingAxis(axis, other, refs) {
    var ours = this.project(axis);
    var theirs = other.project(axis);
    refs.minThis = ours[0] + this.margin;
    refs.maxThis = ours[1] + this.margin;
    refs.minOther = theirs[0] + other.margin;
    refs.maxOther = theirs[1] + other.margin;
    return refs.minThis >= refs.maxOther || refs.minOther >= refs.maxThis
};

BoundingVolume.prototype.beget = function() {
    var F = function() {};
    F.prototype = this;
    return new F();
};
