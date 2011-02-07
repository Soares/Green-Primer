var Particle = function() {
    this.elacticity = .9;
    this.position = null;
    this.velocity = null;
    this.size = 0;
    this.mass = 1;
    this.radius = 1;
    this.sizeSmall = 0;
    this.timeToLive = 0;
    this.colour = [];
    this.drawColour = "";
    this.deltaColour = [];
    this.sharpness = 0;
    return this;
};
Particle.prototype.update = function(delta) {
    var trajectory = new Line(this.position, this.position.plus(this.velocity));
    var intersect = geom.nearestIntersection(trajectory, layout.walls.lines());
    if(intersect) {
        var velocity = geom.reflect(this.velocity, intersect[0]);
        this.velocity = velocity.scale(this.velocity.length() * this.elacticity);
    }
    this.position = this.position.plus(this.velocity);
    this.timeToLive -= delta;
    return this;
};
