var Particle = function() {
    this.elacticity = .9;
    this.position = new Vector();
    this.direction = new Vector(1, 0);
    this.size = 0;
    this.sizeSmall = 0;
    this.timeToLive = 0;
    this.colour = [];
    this.drawColour = "";
    this.deltaColour = [];
    this.sharpness = 0;
    return this;
};
Particle.prototype.update = function(delta, gravity) {
    this.direction = this.direction.plus(gravity);
    var trajectory = new Line(this.position, this.position.plus(this.direction));
    var intersect = geom.nearestIntersection(trajectory, layout.walls.lines());
    if(intersect) {
        var direction = geom.reflect(trajectory, intersect[0], intersect[1]);
        this.direction = direction.scale(this.direction.length() * this.elacticity);
    }
    this.position = this.position.plus(this.direction);
    this.timeToLive -= delta;
    return this;
};
