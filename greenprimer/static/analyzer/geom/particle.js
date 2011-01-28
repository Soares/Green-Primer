var Particle = function() {
    this.position = new Vector();
    this.direction = new Vector();
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
    this.position = this.position.plus(this.direction);
    this.timeToLive -= delta;
    return this;
};
